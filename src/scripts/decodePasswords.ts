import { decrypt } from "../helpers/crypto";
import AccessKeys, { IAccessKey } from "../models/AccessKeys";
import User, { IUser } from "../models/Users";
import bcrypt from 'bcryptjs';

const startPosition = 19;
const endPosition = 40;

// async function decodePasswords(): Promise<void> {
//     console.log('START DECODING...');

//     let modifiedCount: number = 0; 

//     try{
//         const allEncodedCodes: IAccessKey[] = await AccessKeys.find();
//         const allDecodedCodes = allEncodedCodes.map((el) => decrypt(el)).slice(startPosition, endPosition);
//         console.log(allDecodedCodes);

       

//         allDecodedCodes.map(async (decodedCode) => {
//             const allUsers: IUser[] = await User.find({}, { _id: 1, password: 1, code: 1 });

//             const usersDecrypted: IUser[] = await Promise.all(
//                 allUsers.map(async function (el: IUser): Promise<IUser> {
//                     return {
//                         _id: el._id,
//                         code: el.code,
//                         password: !el.code ? (await bcrypt.compare(decodedCode, el.password)) ? 'true' : 'false' : 'false'
//                     };
//                 })
//             );

//             const userDecrypted: IUser | undefined = usersDecrypted.find((el) => el.password === 'true');

//             if (userDecrypted) {
//                 const filter = {_id: userDecrypted._id};
//                 const update = {$set: {code: decodedCode}}

//                 await User.updateOne(filter, update);

//                 modifiedCount++;
//             } else {
//                 console.log(`There is no user with this password: ${decodedCode}`)
//             }

            
//             console.log(`Modified: ${modifiedCount}`);
//             console.log(`Code #${allDecodedCodes.findIndex((val) => val === decodedCode) + 1} done!`)
//         })

//     } catch(err) {
//         console.log(err);
//     } finally {
        
//     }
// }

async function decodePasswords(): Promise<void> {
    console.log('START DECODING...');

    let modifiedCount: number = 0; 

    try{
        const allUsers: IUser[] = await User.find({}, { _id: 1, password: 1, code: 1 });

        const allEncodedCodes: IAccessKey[] = await AccessKeys.find();
        const allDecodedCodes = allEncodedCodes.map((el) => decrypt(el));


        await Promise.all(
              allUsers.slice(startPosition, endPosition).map(async function (el: IUser): Promise<IUser> {
                if (!el.code) {
                    for (const decodedCode of allDecodedCodes) {
                        const match = await bcrypt.compare(decodedCode, el.password);

                        if(match) {
                            const filter = {_id: el._id};
                            const update = {$set: {code: decodedCode}}

                            await User.updateOne(filter, update);

                            modifiedCount++;
                        }
                    }

                } 
                    return el;
              })
            );

    } catch(err) {
        console.log(err);
    } finally {
        console.log('FINISH DECODING...');
        console.log(`Modified: ${modifiedCount}`);
    }
}

decodePasswords();  