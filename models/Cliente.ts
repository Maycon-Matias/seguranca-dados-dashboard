import mongoose, { Document, Schema } from 'mongoose';

// Interface para anexos
export interface IAnexo {
  nome: string;
  url: string;
  publicId?: string; // Para Cloudinary
  tipo: 'video' | 'image' | 'document';
  tamanho: number;
  mimeType: string;
  dataUpload: Date;
}

// Interface para cliente
export interface ICliente extends Document {
  nome: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: Date;
  observacoes?: string;
  anexos: IAnexo[];
  dataCadastro: Date;
  dataAtualizacao: Date;
}

// Schema do anexo
const anexoSchema = new Schema<IAnexo>({
  nome: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String }, // Para Cloudinary
  tipo: { 
    type: String, 
    enum: ['video', 'image', 'document'], 
    required: true 
  },
  tamanho: { type: Number, required: true },
  mimeType: { type: String, required: true },
  dataUpload: { type: Date, default: Date.now }
}, { _id: true });

// Schema do cliente
const clienteSchema = new Schema<ICliente>({
  nome: { type: String, required: true, trim: true },
  cpf: { type: String, trim: true },
  telefone: { type: String, trim: true },
  endereco: { type: String, trim: true },
  dataNascimento: { type: Date },
  observacoes: { type: String, trim: true },
  anexos: [anexoSchema],
  dataCadastro: { type: Date, default: Date.now },
  dataAtualizacao: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'dataCadastro', updatedAt: 'dataAtualizacao' }
});

// Índices para melhor performance
clienteSchema.index({ nome: 'text', cpf: 'text', telefone: 'text' });
clienteSchema.index({ cpf: 1 });
clienteSchema.index({ telefone: 1 });
clienteSchema.index({ dataCadastro: -1 });

// Middleware para atualizar dataAtualizacao
clienteSchema.pre('save', function(next) {
  this.dataAtualizacao = new Date();
  next();
});

// Modelo do cliente - usando coleção específica para não interferir com dados existentes
export const Cliente = mongoose.models.SistemaCliente || mongoose.model<ICliente>('SistemaCliente', clienteSchema, 'sistema_clientes');

export default Cliente;
