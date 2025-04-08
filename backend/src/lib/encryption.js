import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.MESSAGE_SECRET_KEY, "utf8"); // must be 32 bytes
const iv = Buffer.from(process.env.MESSAGE_IV, "utf8"); // must be 16 bytes

export function encryptText(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

export function decryptText(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
