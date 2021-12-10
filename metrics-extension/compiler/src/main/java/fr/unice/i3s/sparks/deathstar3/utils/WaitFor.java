package fr.unice.i3s.sparks.deathstar3.utils;

import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.net.URL;
import java.net.URLConnection;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;

/**
 * https://gist.github.com/rkuzsma/a5f45dcb5bfde6a2fea94ba73c755e3e
 * General utilities to wait for ports and URL responses to be available.
 * Especially useful when waiting for container services to be fully "up".
 */
@Slf4j
public class WaitFor {
    public static void waitForPort(String hostname, int port, long timeoutMs) {
        log.info("Waiting for port " + port);
        long startTs = System.currentTimeMillis();
        boolean scanning = true;
        while (scanning) {
            if (System.currentTimeMillis() - startTs > timeoutMs) {
                throw new RuntimeException("Timeout waiting for port " + port);
            }
            try {
                SocketAddress addr = new InetSocketAddress(hostname, port);
                Selector.open();
                SocketChannel socketChannel = SocketChannel.open();
                socketChannel.configureBlocking(true);
                try {
                    socketChannel.connect(addr);
                } finally {
                    socketChannel.close();
                }

                scanning = false;
            } catch (IOException e) {
                log.debug("Still waiting for port " + port);
                try {
                    Thread.sleep(2000);//2 seconds
                } catch (InterruptedException ie) {
                    log.error("Interrupted", ie);
                }
            }
        }
        log.info("Port " + port + " ready.");
    }

    public static void waitForResponse(String url, String response, int timeoutMS) {
        log.info("Waiting " + timeoutMS + "ms for " + url + " to respond with '" + response + '"');
        long startTS = System.currentTimeMillis();
        while (System.currentTimeMillis() - startTS < timeoutMS) {
            try {
                URL urlConnect = new URL(url);
                URLConnection conn = urlConnect.openConnection();
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(conn.getInputStream()));
                String inputLine;
                StringBuilder sb = new StringBuilder();
                try {
                    while ((inputLine = in.readLine()) != null) {
                        sb.append(inputLine);
                    }
                    if (sb.toString().contains(response)) return;
                } finally {
                    try {
                        in.close();
                    } catch (IOException e) {
                        // ignore and retry ...
                    }
                }
            } catch (IOException e) {
                // assume site is not available yet, retry ...
            }
        }
        throw new RuntimeException("Operation timed out");
    }
}
