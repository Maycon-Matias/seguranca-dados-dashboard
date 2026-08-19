import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Cliente } from '@/models/Cliente';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// GET - Buscar cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const cliente = await Cliente.findById(params.id);
    
    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }
    
    // Converter _id para id no formato JSON
    const clienteJson = cliente.toObject();
    const clienteFormatado = {
      ...clienteJson,
      id: clienteJson._id.toString(),
      _id: clienteJson._id.toString()
    };
    
    return NextResponse.json(clienteFormatado);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Verificar se cliente existe
    const clienteExistente = await Cliente.findById(params.id);
    if (!clienteExistente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se CPF já existe em outro cliente
    if (body.cpf && body.cpf !== clienteExistente.cpf) {
      const clienteComCPF = await Cliente.findOne({ 
        cpf: body.cpf, 
        _id: { $ne: params.id } 
      });
      
      if (clienteComCPF) {
        return NextResponse.json(
          { error: 'CPF já cadastrado' },
          { status: 400 }
        );
      }
    }
    
    // Preparar dados para atualização
    const updateData: any = {
      nome: body.nome,
      cpf: body.cpf,
      telefone: body.telefone,
      endereco: body.endereco,
      observacoes: body.observacoes,
      anexos: body.anexos || []
    };
    
    if (body.dataNascimento) {
      updateData.dataNascimento = new Date(body.dataNascimento);
    }
    
    // Atualizar cliente
    const clienteAtualizado = await Cliente.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // Converter _id para id no formato JSON
    const clienteJson = clienteAtualizado.toObject();
    const clienteFormatado = {
      ...clienteJson,
      id: clienteJson._id.toString(),
      _id: clienteJson._id.toString()
    };
    
    return NextResponse.json(clienteFormatado);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const cliente = await Cliente.findById(params.id);
    
    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }
    
    // Deletar arquivos do Cloudinary se existirem
    if (cliente.anexos && cliente.anexos.length > 0) {
      for (const anexo of cliente.anexos) {
        try {
          // Se tem publicId, deletar do Cloudinary
          if (anexo.publicId) {
            await deleteFromCloudinary(anexo.publicId);
            console.log(`Arquivo deletado do Cloudinary: ${anexo.nome}`);
          }
        } catch (error) {
          console.error(`Erro ao deletar arquivo ${anexo.nome} do Cloudinary:`, error);
          // Continuar com a exclusão dos outros arquivos
        }
      }
    }
    
    // Deletar cliente do banco
    await Cliente.findByIdAndDelete(params.id);
    
    return NextResponse.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}