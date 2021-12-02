export function filname_from_filepath(filePath: string): string{
    return filePath.split('/').slice(-1)[0];
}