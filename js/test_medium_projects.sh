#!/bin/bash

#github_link commit files_count variants_count nodes_count relationship_count unknown_paths_count
ionic=("https://github.com/ionic-team/ionic-framework" "1c719833292d4cfbdecadf9838d8c783785222ad" 275 17 7347 8400 0)
typeorm=("https://github.com/typeorm/typeorm" "58fc08840a4a64ca1935391f4709a784c3f0b373" 639 501 20872 27100 1)
nest=("https://github.com/nestjs/nest" "dbf7f36d91fcad1395135991b1c3b58813feab78" 1180 342 14595 19594 5)
prisma=("https://github.com/prisma/prisma" "95682e0788dedd3f857d9d1dcde998704275b0fa" 499 112 9470 11840 4)
nativeScript=("https://github.com/NativeScript/NativeScript" "dcf6a365cd574bd4dfa245ad6c38c22e551ef65c" 644 207 25932 30043 3)

./test_tool_chain.sh "${ionic[@]}" "${typeorm[@]}" "${nest[@]}" "${prisma[@]}" "${nativeScript[@]}"
