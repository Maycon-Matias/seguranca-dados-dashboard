import { v2 as cloudinary } from 'cloudinary';

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export default cloudinary;

// Função para fazer upload de arquivos
export async function uploadToCloudinary(
  file: File,
  folder: string = 'clientes-videos'
): Promise<{
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  resource_type: string;
  bytes: number;
}> {
  try {
    // Converter File para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Converter Buffer para base64
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;
    
    // Fazer upload para o Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'auto', // Detecta automaticamente se é vídeo, imagem ou documento
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    
    return result;
  } catch (error) {
    console.error('Erro no upload para Cloudinary:', error);
    throw new Error('Falha no upload do arquivo');
  }
}

// Função para deletar arquivo do Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Erro ao deletar do Cloudinary:', error);
    throw new Error('Falha ao deletar arquivo');
  }
}

// Função para extrair public_id da URL do Cloudinary
export function extractPublicId(url: string): string | null {
  try {
    const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|mp4|avi|mov|wmv|pdf|doc|docx)/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
}
