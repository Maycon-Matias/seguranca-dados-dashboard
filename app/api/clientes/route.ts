import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Cliente } from '@/models/Cliente';

// GET - Listar todos os clientes
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Construir filtro de busca
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { nome: { $regex: search, $options: 'i' } },
          { cpf: { $regex: search, $options: 'i' } },
          { telefone: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Buscar clientes com paginação
    const skip = (page - 1) * limit;
    const [clientesRaw, total] = await Promise.all([
      Cliente.find(filter)
        .sort({ dataCadastro: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Cliente.countDocuments(filter)
    ]);
    
    // Converter _id para id em todos os clientes
    const clientes = clientesRaw.map(cliente => {
      const rawId = (cliente as { _id?: unknown })._id;
      let id = '';

      if (typeof rawId === 'string') {
        id = rawId;
      } else if (rawId && typeof rawId === 'object' && 'toString' in rawId) {
        try {
          id = (rawId as { toString: () => string }).toString();
        } catch (error) {
          console.warn('Não foi possível converter _id para string:', error);
        }
      }

      return {
        ...cliente,
        id,
        _id: id
      };
    });
    
    return NextResponse.json({
      clientes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validações básicas
    if (!body.nome) {
      return NextResponse.json(
        { error: 'O campo nome é obrigatório' },
        { status: 400 }
      );
    }
    
    // Verificar se CPF já existe (apenas se fornecido)
    if (body.cpf) {
      const clienteExistente = await Cliente.findOne({ cpf: body.cpf });
      if (clienteExistente) {
        return NextResponse.json(
          { error: 'CPF já cadastrado' },
          { status: 400 }
        );
      }
    }
    
    // Criar novo cliente
    const novoCliente = new Cliente({
      nome: body.nome,
      cpf: body.cpf,
      telefone: body.telefone,
      endereco: body.endereco,
      dataNascimento: body.dataNascimento ? new Date(body.dataNascimento) : undefined,
      observacoes: body.observacoes,
      anexos: body.anexos || []
    });
    
    await novoCliente.save();
    
    return NextResponse.json(novoCliente, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}