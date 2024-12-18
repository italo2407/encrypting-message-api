import { Injectable } from '@nestjs/common';
import { KMSClient, GenerateDataKeyPairCommand, DataKeyPairSpec } from '@aws-sdk/client-kms';

@Injectable()
export class AwsKmsService {
  private kmsClient: KMSClient;

  constructor() {
    this.kmsClient = new KMSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async generateDataKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const params = {
      KeyId: process.env.AWS_KMS_KEY_ID, // ID de tu clave KMS principal
      KeyPairSpec: DataKeyPairSpec.RSA_2048, // Tipo de clave (puedes usar DataKeyPairSpec.ECC_NIST_P256, etc.)
    };

    const command = new GenerateDataKeyPairCommand(params);
    const response = await this.kmsClient.send(command);

    // Devuelve las claves en formato deseado
    return {
      publicKey: response.PublicKey ? Buffer.from(response.PublicKey).toString('base64') : '',
      privateKey: response.PrivateKeyCiphertextBlob
        ? Buffer.from(response.PrivateKeyCiphertextBlob).toString('base64')
        : '',
    };
  }
}
