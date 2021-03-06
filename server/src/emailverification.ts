import { Logger } from './logger'
import { inject, injectable } from 'inversify'
import { Verification, IUserModel, IVerification } from './models'
import { IMailRequest } from './interfaces'
import { Mailer } from "./mailer";
import * as Uuid from 'uuid/v4'

@injectable()
export class EmailVerification {

    constructor( @inject(Logger) private logger: Logger, @inject(Mailer) private mailer: Mailer) { }

    create(user: IUserModel) {

        let verification: IVerification = {
            token: Uuid(),
            user: user._id
        }

        Verification.create(verification).then((createdVerification) => {
            let verificationO = <IVerification>createdVerification.toObject()
            verificationO.user = user
            this.mailer.sendVerificationEmail(verificationO)
        }).catch((err) => {
            this.logger.error(err)
        })

    }
}