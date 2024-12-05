export function getFileSignature(file: File): Promise<number>
{
    return new Promise<number>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function (){
            const signatureBytes = new Uint8Array(reader.result as ArrayBufferLike).slice(0, 4).reverse();
            const signature = new Uint32Array(signatureBytes.buffer);
            resolve(signature[0]);
        };
        reader.onerror = function (){
            reject();
        };
        reader.readAsArrayBuffer(file); 
    });
}

export function getFileMimeTypeFromSignature(signature: number): string
{
    switch(signature)
    {
        case 0x89504e47:
            return "image/png";
        case 0xffd8ffe0:
        case 0xffd8ffe1:
        case 0xffd8ffe2:
        case 0xffd8ffe3:
        case 0xffd8ffe8:
            return "image/jpeg";
        default:
            return "application/octet-stream";
    }
}

export async function getFileMimeType(file: File): Promise<string>
{
    const signature = await getFileSignature(file);
    return getFileMimeTypeFromSignature(signature);
}
