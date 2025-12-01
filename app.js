// ------------------ DADOS MOCKADOS ------------------ //

const cursos = [
  "Engenharia de Software",
  "Engenharia de Telecomunicações",
  "Engenharia Biomédica",
  "Engenharia de Controle e Automação",
  "Sistemas de Informação"
];

const vagas = [
  {
    id: 1,
    titulo: "Estágio em Desenvolvimento Web",
    empresa: "TechLabs",
    cursoAlvo: "Engenharia de Software",
    tipoVaga: "Estágio",
    modalidade: "Híbrido",
    localidade: "Santa Rita do Sapucaí - MG",
    requisitos:
      "Cursando a partir do 4º período de Eng. de Software ou afins; conhecimentos em HTML, CSS e JavaScript.",
    descricao:
      "Atuar no desenvolvimento e manutenção de aplicações web internas, auxiliando na criação de novas funcionalidades e correção de bugs sob supervisão de desenvolvedores mais experientes.",
    prazo: "30/09/2025"
  },
  {
    id: 2,
    titulo: "Estágio em Redes e Infraestrutura",
    empresa: "NetWave Telecom",
    cursoAlvo: "Engenharia de Telecomunicações",
    tipoVaga: "Estágio",
    modalidade: "Presencial",
    localidade: "Pouso Alegre - MG",
    requisitos:
      "Conhecimentos básicos em redes de computadores, configuração de roteadores e protocolos de comunicação.",
    descricao:
      "Auxiliar na configuração, monitoramento e manutenção da infraestrutura de redes da empresa, dando suporte à equipe de operações.",
    prazo: "15/10/2025"
  },
  {
    id: 3,
    titulo: "Desenvolvedor Júnior Mobile",
    empresa: "InovaApps",
    cursoAlvo: "Engenharia de Software",
    tipoVaga: "Emprego",
    modalidade: "Remoto",
    localidade: "Remoto - Brasil",
    requisitos:
      "Formado ou concluindo Eng. Software ou Sistemas de Informação; experiência com Flutter ou React Native.",
    descricao:
      "Desenvolvimento de novos recursos em aplicativos mobile, participação em reuniões de planejamento e correção de problemas em produção.",
    prazo: "Aberta até preencher"
  },
  {
    id: 4,
    titulo: "Estágio em Automação Industrial",
    empresa: "IndusTech",
    cursoAlvo: "Engenharia de Controle e Automação",
    tipoVaga: "Estágio",
    modalidade: "Presencial",
    localidade: "Itajubá - MG",
    requisitos:
      "Conhecimentos em CLP, sensores e atuadores; desejável experiência em projetos acadêmicos.",
    descricao:
      "Atuar no apoio a projetos de automação industrial, testes de painéis e elaboração de documentação técnica.",
    prazo: "10/10/2025"
  },
  {
    id: 5,
    titulo: "Analista de Dados Júnior",
    empresa: "DataMind",
    cursoAlvo: "Sistemas de Informação",
    tipoVaga: "Emprego",
    modalidade: "Híbrido",
    localidade: "São Paulo - SP",
    requisitos:
      "Conhecimentos em SQL, ferramentas de BI e lógica de programação.",
    descricao:
      "Construção de relatórios e dashboards, análise de dados para apoio à tomada de decisão e sustentação de modelos analíticos.",
    prazo: "05/11/2025"
  }
];

const tiposVaga = ["Todos", "Estágio", "Emprego"];


let currentView = "home";
let currentTipo = "Todos";
let currentCurso = cursos[0];
let currentModalidade = "todas";
let currentTab = "todas"; // todas | salvas
let savedIds = new Set();
let candidaturaIds = new Set();
let vagaSelecionada = null;



const viewHome = document.getElementById("view-home");
const viewMural = document.getElementById("view-mural");
const viewDetalhe = document.getElementById("view-detalhe");

const cardMural = document.getElementById("card-mural");
const btnBackHome = document.getElementById("btn-back-home");
const btnBackMural = document.getElementById("btn-back-mural");

const filterCurso = document.getElementById("filter-curso");
const filterModalidade = document.getElementById("filter-modalidade");
const chipsTipoContainer = document.getElementById("chips-tipo");
const btnResetFilters = document.getElementById("btn-reset-filters");
const listaVagas = document.getElementById("lista-vagas");

const tabs = document.querySelectorAll(".tab");
const detalheContainer = document.getElementById("detalhe-container");

const snackbar = document.getElementById("snackbar");
const snackbarText = document.getElementById("snackbar-text");



function showView(name) {
  currentView = name;
  viewHome.classList.remove("active");
  viewMural.classList.remove("active");
  viewDetalhe.classList.remove("active");

  if (name === "home") viewHome.classList.add("active");
  if (name === "mural") viewMural.classList.add("active");
  if (name === "detalhe") viewDetalhe.classList.add("active");
}

function showSnackbar(message) {
  snackbarText.textContent = message;
  snackbar.classList.add("show");
  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 2200);
}

function formatBadgeCurso(curso) {
  return curso.replace("Engenharia", "Eng.").replace("Sistemas", "Sist.");
}



function initFilters() {

  filterCurso.innerHTML = "";
  cursos.forEach((curso) => {
    const opt = document.createElement("option");
    opt.value = curso;
    opt.textContent = curso;
    filterCurso.appendChild(opt);
  });
  filterCurso.value = currentCurso;


  chipsTipoContainer.innerHTML = "";
  tiposVaga.forEach((tipo) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (tipo === currentTipo ? " active" : "");
    chip.dataset.tipo = tipo;
    chip.textContent = tipo;
    chip.addEventListener("click", () => {
      currentTipo = tipo;
      document
        .querySelectorAll("#chips-tipo .chip")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderListaVagas();
    });
    chipsTipoContainer.appendChild(chip);
  });
}



function vagaPassaNosFiltros(vaga, apenasSalvas = false) {
  if (apenasSalvas && !savedIds.has(vaga.id)) return false;

  if (currentTipo !== "Todos" && vaga.tipoVaga !== currentTipo) {
    return false;
  }
  if (currentModalidade !== "todas" && vaga.modalidade !== currentModalidade) {
    return false;
  }
  if (vaga.cursoAlvo !== currentCurso) {
    return false;
  }
  return true;
}

function renderListaVagas() {
  listaVagas.innerHTML = "";

  const apenasSalvas = currentTab === "salvas";
  const filtradas = vagas.filter((vaga) =>
    vagaPassaNosFiltros(vaga, apenasSalvas)
  );

  if (filtradas.length === 0) {
    const empty = document.createElement("div");
    empty.className = "list-empty";
    empty.innerHTML = apenasSalvas
      ? "Você ainda não salvou nenhuma vaga com os filtros atuais."
      : "Nenhuma vaga encontrada para os filtros selecionados. Tente ajustar o curso, tipo ou modalidade.";
    listaVagas.appendChild(empty);
    return;
  }

  filtradas.forEach((vaga) => {
    const card = document.createElement("article");
    card.className = "vaga-card";

    const header = document.createElement("div");
    header.className = "vaga-card-header";

    const left = document.createElement("div");
    const right = document.createElement("div");

    const title = document.createElement("div");
    title.className = "vaga-card-title";
    title.textContent = vaga.titulo;

    const company = document.createElement("div");
    company.className = "vaga-card-company";
    company.textContent = vaga.empresa;

    const tags = document.createElement("div");
    tags.className = "vaga-tags";

    const badgeTipo = document.createElement("span");
    badgeTipo.className = "badge";
    badgeTipo.textContent = vaga.tipoVaga;

    const badgeMod = document.createElement("span");
    badgeMod.className = "badge badge-outline";
    badgeMod.textContent = vaga.modalidade;

    const badgeCurso = document.createElement("span");
    badgeCurso.className = "badge badge-outline";
    badgeCurso.textContent = formatBadgeCurso(vaga.cursoAlvo);

    tags.appendChild(badgeTipo);
    tags.appendChild(badgeMod);
    tags.appendChild(badgeCurso);

    left.appendChild(title);
    left.appendChild(company);
    left.appendChild(tags);

    const btnSave = document.createElement("button");
    btnSave.type = "button";
    btnSave.className =
      "vaga-save-btn" + (savedIds.has(vaga.id) ? " saved" : "");
    btnSave.innerHTML = savedIds.has(vaga.id) ? "★" : "☆";
    btnSave.title = savedIds.has(vaga.id)
      ? "Remover dos salvos"
      : "Salvar vaga";

    btnSave.addEventListener("click", (ev) => {
      ev.stopPropagation(); 
      toggleSalvarVaga(vaga.id);
    });

    right.appendChild(btnSave);

    header.appendChild(left);
    header.appendChild(right);

    const footer = document.createElement("div");
    footer.className = "vaga-footer-text";
    footer.textContent = vaga.localidade + " · Prazo: " + vaga.prazo;

    card.appendChild(header);
    card.appendChild(footer);

    card.addEventListener("click", () => {
      abrirDetalheVaga(vaga.id);
    });

    listaVagas.appendChild(card);
  });
}



function abrirDetalheVaga(id) {
  const vaga = vagas.find((v) => v.id === id);
  if (!vaga) return;
  vagaSelecionada = vaga;

  detalheContainer.innerHTML = "";

  const card = document.createElement("div");
  card.className = "detail-card";

  const title = document.createElement("div");
  title.className = "detail-title";
  title.textContent = vaga.titulo;

  const company = document.createElement("div");
  company.className = "detail-company";
  company.textContent = vaga.empresa + " · " + vaga.localidade;

  const tags = document.createElement("div");
  tags.className = "vaga-tags";
  const b1 = document.createElement("span");
  b1.className = "badge";
  b1.textContent = vaga.tipoVaga;
  const b2 = document.createElement("span");
  b2.className = "badge badge-outline";
  b2.textContent = vaga.modalidade;
  const b3 = document.createElement("span");
  b3.className = "badge badge-outline";
  b3.textContent = formatBadgeCurso(vaga.cursoAlvo);
  tags.appendChild(b1);
  tags.appendChild(b2);
  tags.appendChild(b3);

  const secReq = document.createElement("div");
  secReq.className = "detail-section-title";
  secReq.textContent = "Requisitos";

  const txtReq = document.createElement("div");
  txtReq.className = "detail-text";
  txtReq.textContent = vaga.requisitos;

  const secDesc = document.createElement("div");
  secDesc.className = "detail-section-title";
  secDesc.textContent = "Descrição da vaga";

  const txtDesc = document.createElement("div");
  txtDesc.className = "detail-text";
  txtDesc.textContent = vaga.descricao;

  const secPrazo = document.createElement("div");
  secPrazo.className = "detail-section-title";
  secPrazo.textContent = "Prazo para candidatura";

  const txtPrazo = document.createElement("div");
  txtPrazo.className = "detail-text";
  txtPrazo.textContent = vaga.prazo;

  const actions = document.createElement("div");
  actions.className = "detail-actions";

  const btnCandidatar = document.createElement("button");
  btnCandidatar.className = "btn btn-primary";
  btnCandidatar.innerHTML = "Candidatar-se";

  btnCandidatar.addEventListener("click", () => {
    candidaturaIds.add(vaga.id);
    showSnackbar("Candidatura registrada (simulação).");
  });

  const btnSalvar = document.createElement("button");
  btnSalvar.className =
    "btn btn-soft" + (savedIds.has(vaga.id) ? " saved" : "");
  btnSalvar.innerHTML = savedIds.has(vaga.id)
    ? "Remover dos salvos"
    : "Salvar vaga";

  btnSalvar.addEventListener("click", () => {
    toggleSalvarVaga(vaga.id);
    btnSalvar.innerHTML = savedIds.has(vaga.id)
      ? "Remover dos salvos"
      : "Salvar vaga";
  });

  actions.appendChild(btnCandidatar);
  actions.appendChild(btnSalvar);

  card.appendChild(title);
  card.appendChild(company);
  card.appendChild(tags);
  card.appendChild(secReq);
  card.appendChild(txtReq);
  card.appendChild(secDesc);
  card.appendChild(txtDesc);
  card.appendChild(secPrazo);
  card.appendChild(txtPrazo);
  card.appendChild(actions);

  detalheContainer.appendChild(card);

  showView("detalhe");
}



function toggleSalvarVaga(id) {
  if (savedIds.has(id)) {
    savedIds.delete(id);
    showSnackbar("Vaga removida dos salvos.");
  } else {
    savedIds.add(id);
    showSnackbar("Vaga salva com sucesso.");
  }
  renderListaVagas();
}



cardMural.addEventListener("click", () => {
  showView("mural");
  renderListaVagas();
});

btnBackHome.addEventListener("click", () => {
  showView("home");
});

btnBackMural.addEventListener("click", () => {
  showView("mural");
  renderListaVagas();
});

filterCurso.addEventListener("change", () => {
  currentCurso = filterCurso.value;
  renderListaVagas();
});

filterModalidade.addEventListener("change", () => {
  currentModalidade = filterModalidade.value;
  renderListaVagas();
});

btnResetFilters.addEventListener("click", () => {
  currentCurso = cursos[0];
  currentTipo = "Todos";
  currentModalidade = "todas";
  filterCurso.value = currentCurso;
  filterModalidade.value = "todas";
  initFilters();
  renderListaVagas();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;
    renderListaVagas();
  });
});



initFilters();
renderListaVagas();
