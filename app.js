(function () {
  "use strict";

  var STORE_KEY = "estudo-biblico-v1";
  var STORIES = window.STORIES || [];
  var app = document.getElementById("app");

  // ---------- Dados salvos no iPhone ----------
  // reads: { idDaHistoria: ["2026-11-07", ...] } — cada data em que você marcou "Já li".
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      var data = raw ? JSON.parse(raw) : {};
      if (!data.reads || typeof data.reads !== "object") data.reads = {};
      return data;
    } catch (e) {
      return { reads: {} };
    }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  var state = load();

  // ---------- Datas ----------
  function todayKey(d) {
    d = d || new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }
  function keyToDate(k) {
    var p = k.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function daysBetween(a, b) {
    return Math.round((keyToDate(b) - keyToDate(a)) / 86400000);
  }
  function shortDate(k) {
    var p = k.split("-");
    return p[2] + "/" + p[1];
  }

  // ---------- Sequência (nunca zera) ----------
  function readingDays() {
    var set = {};
    Object.keys(state.reads).forEach(function (id) {
      (state.reads[id] || []).forEach(function (k) { set[k] = true; });
    });
    return Object.keys(set).sort();
  }
  function streakInfo() {
    var days = readingDays();
    var today = todayKey();
    var count = days.length;
    var readToday = days.indexOf(today) !== -1;
    var last = days.filter(function (k) { return k !== today; }).pop();
    var away = last ? daysBetween(last, today) - 1 : 0;
    var msg;
    if (count === 0) {
      msg = "Escolha uma história e comece hoje.";
    } else if (readToday) {
      msg = "Leitura de hoje feita. Até amanhã!";
    } else if (away >= 1) {
      msg = "Que bom te ver de novo! Você ficou " + away + (away === 1 ? " dia" : " dias") +
        " fora. A sequência continua de onde parou — leia hoje para chegar a " + (count + 1) + ".";
    } else {
      msg = "Leia hoje para chegar a " + (count + 1) + ".";
    }
    return { count: count, msg: msg, readToday: readToday };
  }

  // ---------- Histórias ----------
  function byId(id) {
    for (var i = 0; i < STORIES.length; i++) if (STORIES[i].id === id) return STORIES[i];
    return null;
  }
  function lastRead(id) {
    var list = state.reads[id] || [];
    return list.length ? list[list.length - 1] : null;
  }
  function nextStory() {
    for (var i = 0; i < STORIES.length; i++) if (!lastRead(STORIES[i].id)) return STORIES[i];
    // Leu todas: sugere a que faz mais tempo que você leu.
    return STORIES.slice().sort(function (a, b) {
      return lastRead(a.id) < lastRead(b.id) ? -1 : 1;
    })[0];
  }
  function fullTitle(s) {
    return s.parte ? s.titulo + " (" + s.parte.split(" · ")[0] + ")" : s.titulo;
  }

  function quizPrompt(s) {
    return [
      "Acabei de ler " + fullTitle(s) + ", em " + s.referencia + ", na Bíblia NVI. Quero testar o que entendi.",
      "",
      "Faça um quiz de múltipla escolha com " + s.perguntas + " perguntas sobre esse trecho, com 4 alternativas cada (A, B, C e D).",
      "",
      "Regras:",
      "- Faça uma pergunta por vez e espere minha resposta antes de seguir.",
      "- Depois de cada resposta, diga se acertei e explique em uma ou duas frases, indicando o versículo.",
      "- Pergunte só sobre o que está nesse trecho, do mais fácil para o mais difícil.",
      "- No final, diga quantas eu acertei e deixe uma pergunta curta para eu refletir."
    ].join("\n");
  }

  // ---------- Pequenas peças de tela ----------
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  var CROSS = '<svg class="cross" width="18" height="26" viewBox="0 0 18 26" aria-hidden="true">' +
    '<rect x="7.5" y="0" width="3" height="26" rx="1" fill="currentColor"/>' +
    '<rect x="0" y="6.5" width="18" height="3" rx="1" fill="currentColor"/></svg>';
  var CHECK = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CHEV = '<svg class="chev" width="10" height="16" viewBox="0 0 10 16" aria-hidden="true"><path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var toastTimer;
  function toast(text) {
    var el = document.getElementById("toast");
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2600);
  }

  // ---------- Telas ----------
  function renderHome() {
    var st = streakInfo();
    var nx = nextStory();
    var html = '<header class="brand">' + CROSS + '<h1>Estudo Bíblico</h1><p>Leia na sua Bíblia, um passo por dia</p></header>';

    html += '<section class="card streak"><div class="num">' + st.count + '</div>' +
      '<div class="unit">' + (st.count === 1 ? "dia de leitura" : "dias de leitura") + '</div>' +
      '<p class="msg">' + esc(st.msg) + '</p></section>';

    if (nx) {
      html += '<a class="card next" href="#/h/' + nx.id + '">' +
        '<div class="label">' + (lastRead(nx.id) ? "Que tal reler" : "Próxima leitura") + '</div>' +
        '<h2>' + esc(nx.titulo) + '</h2>' +
        (nx.parte ? '<div class="meta">' + esc(nx.parte) + '</div>' : "") +
        '<div class="ref">' + esc(nx.referencia) + ' <span class="meta">· cerca de ' + nx.minutos + ' min</span></div></a>';
    }

    [["AT", "Antigo Testamento"], ["NT", "Novo Testamento"]].forEach(function (g) {
      var items = STORIES.filter(function (s) { return s.testamento === g[0]; });
      if (!items.length) return;
      html += '<h3 class="section-title">' + g[1] + '</h3><nav class="list">';
      items.forEach(function (s) {
        var lr = lastRead(s.id);
        html += '<a class="row" href="#/h/' + s.id + '">' +
          '<span class="check' + (lr ? " on" : "") + '" aria-label="' + (lr ? "Já lida" : "Ainda não lida") + '">' + (lr ? CHECK : "") + '</span>' +
          '<span class="grow"><div class="t">' + esc(s.titulo) + '</div>' +
          '<div class="s">' + esc(s.parte ? s.parte.split(" · ")[0] + " · " : "") + esc(s.referencia) + ' · ' + s.minutos + ' min</div></span>' +
          CHEV + '</a>';
      });
      html += '</nav>';
    });

    html += '<div class="foot"><a href="#/ajustes">Ajustes e backup</a></div>';
    app.innerHTML = html;
  }

  function renderStory(id) {
    var s = byId(id);
    if (!s) { location.hash = "#/"; return; }
    var lr = lastRead(s.id);
    var times = (state.reads[s.id] || []).length;

    var html = '<button class="back" data-act="home">' +
      '<svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true"><path d="M8 2L2 8l6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Histórias</button>';

    html += '<header class="story-head">' + CROSS +
      '<div class="label">' + (s.testamento === "AT" ? "Antigo Testamento" : "Novo Testamento") + '</div>' +
      '<h1>' + esc(s.titulo) + '</h1>' +
      (s.parte ? '<div class="parte">' + esc(s.parte) + '</div>' : "") + '</header>';

    html += '<section class="card"><dl class="ctx">' +
      '<dt>Autor</dt><dd>' + esc(s.autor) + '</dd>' +
      '<dt>Época</dt><dd>' + esc(s.epoca) + '</dd>' +
      '<dt>Lugar</dt><dd>' + esc(s.lugar) + '</dd></dl>' +
      '<p class="summary">' + esc(s.resumo) + '</p></section>';

    html += '<section class="card read-box"><div class="label">Leia na sua Bíblia</div>' +
      '<div class="ref">' + esc(s.referencia) + '</div>' +
      '<div class="meta">Cerca de ' + s.minutos + ' minutos</div>' +
      (s.nota ? '<p class="note">' + esc(s.nota) + '</p>' : "") + '</section>';

    html += '<section class="card">';
    if (lr) {
      html += '<p class="done-line">Lida em ' + shortDate(lr) + (times > 1 ? " · " + times + " vezes" : "") + '</p>' +
        (lr === todayKey() ? "" : '<button class="btn quiet" data-act="read">Li de novo hoje</button>');
    } else {
      html += '<button class="btn" data-act="read">Já li</button>';
    }
    html += '</section>';

    html += '<section class="card"><div class="label" style="margin-bottom:10px">Depois da leitura</div>' +
      '<button class="btn quiet" data-act="quiz">Copiar prompt do quiz</button>' +
      '<a class="btn quiet" href="https://claude.ai/new" target="_blank" rel="noopener">Abrir o Claude</a>' +
      '<p class="note" style="text-align:center">Copie, abra o Claude e cole na conversa. São ' + s.perguntas + ' perguntas de múltipla escolha.</p></section>';

    if (lr) html += '<button class="link-btn" data-act="undo">Desmarcar a última leitura</button>';

    app.innerHTML = html;
    app.dataset.story = s.id;
  }

  function renderSettings() {
    var days = readingDays();
    var html = '<button class="back" data-act="home">' +
      '<svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true"><path d="M8 2L2 8l6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Histórias</button>';
    html += '<header class="story-head">' + CROSS + '<h1>Ajustes e backup</h1></header>';
    html += '<section class="card settings">' +
      '<p>Seu progresso fica guardado só neste iPhone. Faça um backup de vez em quando e guarde o arquivo no app Arquivos ou no iCloud Drive.</p>' +
      '<p class="meta">' + days.length + ' dias de leitura registrados' +
      (state.ultimoBackup ? ' · último backup em ' + shortDate(state.ultimoBackup) : ' · nenhum backup ainda') + '</p>' +
      '<button class="btn" data-act="export">Fazer backup</button>' +
      '<button class="btn quiet" data-act="import">Restaurar backup</button>' +
      '<input type="file" id="file" accept="application/json,.json">' +
      '<p class="note">Restaurar junta o backup com o que já está no app — nada é apagado.</p></section>';
    app.innerHTML = html;
  }

  // ---------- Ações ----------
  function markRead(id) {
    var before = readingDays().length;
    var today = todayKey();
    var list = state.reads[id] || (state.reads[id] = []);
    if (list[list.length - 1] !== today) list.push(today);
    save();
    var after = readingDays().length;
    toast(after > before ? "Dia " + after + " de leitura. Muito bem!" : "Leitura registrada.");
    renderStory(id);
  }
  function undoRead(id) {
    var list = state.reads[id] || [];
    list.pop();
    if (!list.length) delete state.reads[id];
    save();
    toast("Leitura desmarcada.");
    renderStory(id);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select(); ta.setSelectionRange(0, text.length);
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  function exportBackup() {
    var data = { app: "estudo-biblico", versao: 1, exportadoEm: new Date().toISOString(), reads: state.reads };
    var name = "estudo-biblico-backup-" + todayKey() + ".json";
    var text = JSON.stringify(data, null, 2);
    var done = function () { state.ultimoBackup = todayKey(); save(); renderSettings(); };
    try {
      var file = new File([text], name, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "Backup do Estudo Bíblico" })
          .then(function () { done(); toast("Backup salvo."); })
          .catch(function () {});
        return;
      }
    } catch (e) {}
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    done(); toast("Backup baixado.");
  }

  function importBackup(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!data || data.app !== "estudo-biblico" || typeof data.reads !== "object") throw new Error();
        var added = 0;
        Object.keys(data.reads).forEach(function (id) {
          var incoming = (data.reads[id] || []).filter(function (k) { return /^\d{4}-\d{2}-\d{2}$/.test(k); });
          var set = {};
          (state.reads[id] || []).concat(incoming).forEach(function (k) { set[k] = true; });
          var merged = Object.keys(set).sort();
          added += merged.length - (state.reads[id] || []).length;
          if (merged.length) state.reads[id] = merged;
        });
        save();
        renderSettings();
        toast(added ? "Backup restaurado." : "Backup lido — já estava tudo aqui.");
      } catch (e) {
        toast("Esse arquivo não parece um backup deste app.");
      }
    };
    reader.readAsText(file);
  }

  app.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var act = b.dataset.act;
    var id = app.dataset.story;
    if (act === "home") location.hash = "#/";
    else if (act === "read") markRead(id);
    else if (act === "undo") undoRead(id);
    else if (act === "quiz") {
      copyText(quizPrompt(byId(id)))
        .then(function () { toast("Prompt copiado. Agora é só colar no Claude."); })
        .catch(function () { toast("Não deu para copiar. Tente de novo."); });
    }
    else if (act === "export") exportBackup();
    else if (act === "import") document.getElementById("file").click();
  });
  app.addEventListener("change", function (e) {
    if (e.target.id === "file" && e.target.files[0]) importBackup(e.target.files[0]);
  });

  // ---------- Navegação ----------
  function route() {
    var h = location.hash || "#/";
    delete app.dataset.story;
    if (h.indexOf("#/h/") === 0) renderStory(decodeURIComponent(h.slice(4)));
    else if (h === "#/ajustes") renderSettings();
    else renderHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  // Ao voltar para o app num novo dia, atualiza a mensagem da sequência.
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && (location.hash || "#/") === "#/") renderHome();
  });
  route();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
