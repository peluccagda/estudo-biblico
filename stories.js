// Biblioteca de histórias. O app não contém o texto bíblico:
// apenas indica onde ler na sua Bíblia (NVI).
// Para adicionar uma história nova, copie um bloco e mude os campos.
window.STORIES = [
  {
    id: "criacao",
    titulo: "A Criação",
    testamento: "AT",
    referencia: "Gênesis 1:1–2:3",
    minutos: 5,
    perguntas: 5,
    autor: "Moisés",
    epoca: "No princípio de tudo",
    lugar: "O universo e a terra",
    resumo: "Deus cria o céu, a terra e tudo o que existe em seis dias, forma o ser humano à sua imagem e descansa no sétimo dia."
  },
  {
    id: "jardim",
    titulo: "Adão e Eva no jardim",
    testamento: "AT",
    referencia: "Gênesis 3",
    minutos: 4,
    perguntas: 5,
    autor: "Moisés",
    epoca: "Logo após a criação",
    lugar: "Jardim do Éden",
    resumo: "A serpente tenta Eva, o primeiro casal desobedece a Deus e deixa o jardim — mas já aparece a primeira promessa de redenção."
  },
  {
    id: "noe",
    titulo: "A Arca de Noé",
    testamento: "AT",
    referencia: "Gênesis 6:9–9:17",
    minutos: 12,
    perguntas: 7,
    autor: "Moisés",
    epoca: "Muito antes de Abraão",
    lugar: "A arca para nos montes de Ararate (atual Turquia)",
    resumo: "Noé constrói a arca, sua família e os animais sobrevivem ao dilúvio, e Deus faz uma aliança com o sinal do arco-íris."
  },
  {
    id: "babel",
    titulo: "A Torre de Babel",
    testamento: "AT",
    referencia: "Gênesis 11:1-9",
    minutos: 2,
    perguntas: 3,
    autor: "Moisés",
    epoca: "Depois do dilúvio",
    lugar: "Planície de Sinear, na Mesopotâmia (atual Iraque)",
    resumo: "A humanidade tenta construir uma torre até o céu para fazer um nome para si, e Deus confunde as línguas e espalha os povos."
  },
  {
    id: "jose-1",
    titulo: "José do Egito",
    parte: "Parte 1 de 3 · Vendido pelos irmãos",
    testamento: "AT",
    referencia: "Gênesis 37 e 39",
    minutos: 9,
    perguntas: 6,
    autor: "Moisés",
    epoca: "Cerca de 1900 a.C.",
    lugar: "Canaã e Egito",
    resumo: "O filho preferido de Jacó tem sonhos, é vendido pelos irmãos como escravo e, mesmo fiel no Egito, acaba na prisão.",
    nota: "O capítulo 38 conta outra história (Judá e Tamar), por isso ele fica de fora aqui."
  },
  {
    id: "jose-2",
    titulo: "José do Egito",
    parte: "Parte 2 de 3 · Os sonhos do faraó",
    testamento: "AT",
    referencia: "Gênesis 40–41",
    minutos: 12,
    perguntas: 7,
    autor: "Moisés",
    epoca: "Cerca de 1885 a.C.",
    lugar: "Egito",
    resumo: "Na prisão, José interpreta sonhos; depois decifra os sonhos do faraó e se torna governador de todo o Egito."
  },
  {
    id: "jose-3",
    titulo: "José do Egito",
    parte: "Parte 3 de 3 · O reencontro",
    testamento: "AT",
    referencia: "Gênesis 42–45",
    minutos: 18,
    perguntas: 7,
    autor: "Moisés",
    epoca: "Cerca de 1875 a.C.",
    lugar: "Egito e Canaã",
    resumo: "A fome leva os irmãos ao Egito sem saber que falam com José. Depois de testá-los, ele se revela e os perdoa.",
    nota: "É a parte mais longa. Se preferir, leia os capítulos 42–43 num dia e 44–45 no outro."
  },
  {
    id: "mar-vermelho",
    titulo: "Moisés e o mar Vermelho",
    testamento: "AT",
    referencia: "Êxodo 14",
    minutos: 5,
    perguntas: 5,
    autor: "Moisés",
    epoca: "Cerca de 1446 a.C.",
    lugar: "Entre o Egito e o deserto do Sinai",
    resumo: "Perseguido pelo exército do faraó, o povo de Israel atravessa o mar em terra seca quando Deus abre as águas."
  },
  {
    id: "davi-golias",
    titulo: "Davi e Golias",
    testamento: "AT",
    referencia: "1 Samuel 17:1-54",
    minutos: 9,
    perguntas: 7,
    autor: "Samuel, completado pelos profetas Natã e Gade",
    epoca: "Cerca de 1025 a.C.",
    lugar: "Vale de Elá, em Judá",
    resumo: "Um jovem pastor enfrenta o gigante filisteu com uma funda e cinco pedras, confiando em Deus e não em armadura."
  },
  {
    id: "daniel",
    titulo: "Daniel na cova dos leões",
    testamento: "AT",
    referencia: "Daniel 6",
    minutos: 5,
    perguntas: 5,
    autor: "Daniel",
    epoca: "Cerca de 539 a.C.",
    lugar: "Babilônia, no reinado de Dario, o medo",
    resumo: "Daniel continua orando a Deus mesmo proibido por lei, é lançado aos leões e sai ileso."
  },
  {
    id: "nascimento",
    titulo: "O nascimento de Jesus",
    testamento: "NT",
    referencia: "Lucas 2:1-20",
    minutos: 3,
    perguntas: 4,
    autor: "Lucas, médico e companheiro de Paulo",
    epoca: "Cerca de 5 a.C.",
    lugar: "Belém, na Judeia",
    resumo: "José e Maria viajam a Belém, Jesus nasce e é colocado numa manjedoura, e anjos anunciam a notícia aos pastores."
  },
  {
    id: "ressurreicao",
    titulo: "A ressurreição de Jesus",
    testamento: "NT",
    referencia: "Lucas 24:1-12",
    minutos: 2,
    perguntas: 4,
    autor: "Lucas, médico e companheiro de Paulo",
    epoca: "Cerca de 30 d.C.",
    lugar: "Jerusalém",
    resumo: "No domingo de manhã, mulheres encontram o túmulo vazio e ouvem dos anjos que Jesus ressuscitou."
  }
];
