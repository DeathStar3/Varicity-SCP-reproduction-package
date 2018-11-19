package sources.paperexample;

import java.awt.*;

public class Rectangle extends Shape {

    private final double width, length;

    public Rectangle(double width, double length) {
        this.width = width;
        this.length = length;
    }

    public double area() {
        return width * length;
    }

    public double perimeter() {
        return 2 * (width + length);
    }

    public void draw(int x, int y) {
        // rectangle at (x, y, width, length)
    }

    public void draw(Point p) { // Point defined
        // rectangle at (p.x, p.y, width, length)
    }

}