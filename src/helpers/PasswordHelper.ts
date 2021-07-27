import bcrypt from "bcrypt";


export class Passwordhelper {
    static async createHash(password: string): Promise<string> {
        return new Promise<string>((res, rej) => {
            bcrypt.hash(password, 5, function (err, hash) {
                if (err) return rej();
                return res(hash);
            });
        });
    }

    static async checkPassword(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }
}