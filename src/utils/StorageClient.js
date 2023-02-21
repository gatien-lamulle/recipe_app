import { Web3Storage } from 'web3.storage'
import { v4 as uuidv4 } from 'uuid';
import Compressor from 'compressorjs';

const maxSize = 300 * 1024; // 300 KB

class StorageClient {    
    constructor() {
        this.client = new Web3Storage({
            token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY,
        })
    }

    async compressImage(file) {
        return new Promise((resolve, reject) => {
            new Compressor(file, {
                quality: 0.6,
                minWidth: 500,
                mimeType: 'image/jpeg',
                success: (result) => {
                    resolve(result);
                },
                error: (err) => {
                    reject(err);
                }
            });
        });
    }

    async storeFiles(file) {
        console.log(file);
        if (file.size > maxSize) {
            file = await this.compressImage(file);
        }
        console.log(file);
        const ext = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${ext}`;
        const newFile = new File([file], fileName, {type: file.type});
        const cid = await this.client.put([newFile], {
            name: fileName,
        });
        const imageURI = `https://${cid}.ipfs.w3s.link/${fileName}`;
        return imageURI;
    }
}
export default StorageClient