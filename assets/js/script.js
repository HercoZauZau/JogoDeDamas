window.onload = function () {
  /*

  JOGO DE DAMAS v3.0
  AUTOR: HERCO FERNANDO TAIMO ZAUZAU
  EMAIL: ZAUZAUHERCO@GMAIL.COM
  DATA:

  REGRAS BASICAS
  
  * OS DADOS SE MOVIMENTAM APENAS PARA FRENTE. EXCEPTO EM CASOS DE HAVER UM OPOSTO LOGO ATRAS. AI PODEM VOLTAR PARA ATACAR;

  * OS DADOS NAO SAO BOLQUEADOS APOS SE MOVIMENTAREM POR CAUSA DE CASOS EM QUE O JOGADOR DEVA JOGAR MAIS DE UMA VEZ PARA ATACAR MULTIPLOS DADOS OPOSTOS;

  * EM CASOS DE BOLAS INIMIGAS ALINHADAS NA MESMA DIAGONAL COM ABERTURAS DE ATAQUE, PODE SE ATACAR MAIS DE UMA AO MESMO TEMPO. MAS SE ESTIVEREM EM DIAGONAIS DIFERENTES, SERA PRECISO ATACAR UMA POR UMA, POR LOGICA DO MOVIMENTO DA BOLA;
  
  */

  let box = document.querySelectorAll("td");

  let jogadorAtual = "claras"; // TIPO DE BOLA EM JOGO

  let jogadorContrario = "escuras";

  let lista = [[], [], [], [], [], [], [], []]; //  CADA POSICAO CONTEM UMA LINHA DA TABELA COM SEUS RESPECTIVOS QUADRADOS

  let posBox = 0; // PARA CONTAR TODAS POSICOES DOS QUADRADOS DA TABELA

  let jogaDenovo = false; // CASO O JOGADOR NAO TENHA NENHUM ATAQUE DISPONIVEL APOS A JOGADA, A VEZ PASSA PARA O OUTRO

  let modoAtaqueObrigatorio = true; //SE HOUVER UM ATAQUE DISPONIVEL, O JOGADOR NAO TERA OUTRA JOGADA SENAO O ATAQUE

  // GERAR DADOS NECESSARIOS PARA JOGAR ===========================================================================================================

  //   LACOS DO BOX
  for (let i = 0; i < box.length; i++) {
    //   ATRIBUIR EVENTO "CLICAR"
    box[i].addEventListener("click", () => {
      clicar(i);
    });
  }

  for (let i = 0; i < lista.length; i++) {
    //ORGANIZAR OS QUADRADOS EM ORDEM A LINHA
    for (let j = 0; j < 8; j++) {
      //MUDAR DE 8 A 8 QUADRADOS
      lista[i][j] = box[posBox];
      posBox++;
    }
  }

  for (let i = 0; i < lista.length; i++) {
    //GERAR UMA DIV "BOLA" NAS POSICOES CERTAS
    for (let j = 0; j < 8; j++) {
      if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) {
        lista[i][j].setAttribute("tipoDeQuadrado", "preto");

        if (i < 3) {
          lista[i][j].setAttribute("tipoBola", "escuras");
          lista[i][j].innerHTML = `<div class="escuras"></div>`;
          lista[i][j].setAttribute("temBola", 1);
        } else if (i > 4) {
          lista[i][j].setAttribute("tipoBola", "claras");
          lista[i][j].innerHTML = `<div class="claras"></div>`;
          lista[i][j].setAttribute("temBola", 1);
        }
      }
    }
  }

  // ===============================================================================================================================================

  //   GERAR EFEITOS AO CLICAR SOBRE O QUADRADO

  function clicar(i) {
    let naoGerarCores;

    if (box[i].style.borderColor == "green") {
      apagarBolas(i);
    }

    // NAO DEVE GERAR CORES SE A BOX ESTIVER VERMELHA
    if (
      box[i].style.borderColor == "yellow" ||
      box[i].style.borderColor == "green"
    ) {
      naoGerarCores = true;
    } else {
      naoGerarCores = false;
    }

    geraBola(i);
    limpaCores();

    if (!naoGerarCores || jogaDenovo) {
      trancar(jogadorAtual);
      geraCores(i);
    }

    if (modoAtaqueObrigatorio) {
      ataqueObrigatorio();
    }

    if (
      box[i].getAttribute("bloqueado") == 1 &&
      box[i].getAttribute("tipoBola") == jogadorAtual
    ) {
      let oneTime = false;
      for (let x = 0; x < box.length && !oneTime; x++) {
        if (
          box[x].getAttribute("bloqueado") != 1 &&
          box[x].getAttribute("tipoBola") == box[i].getAttribute("tipoBola")
        ) {
          box[x].style.borderColor = `#ffff00fc`;
          oneTime = true;
          // GERAR CORES PARA APENAS UMA BOLA PARA EVITAR DUAS BOLAS SUMIREM AO MESMO TEMPO SENDO QUE AMBAS TERAO AMARELO
        }
      }
    }
  }

  // ===============================================================================================================================================

  function geraBola(i) {
    let bolaAnterior;
    let nrAnterior;

    if (box[i].style.borderColor == "green") {
      // LIMPAR A BOLA ANTERIOR
      for (let x = 0; x < box.length; x++) {
        if (box[x].style.borderColor == "yellow") {
          // COLETAR DADOS DA BOLA PARA GERAR A PROXIMA
          bolaAnterior = box[x].getAttribute("tipoBola");
          nrAnterior = x;
          // REMOVER DADOS E BOLA
          box[x].innerHTML = "";

          box[x].removeAttribute("temBola");
          box[x].setAttribute("temBola", 0);
          box[x].removeAttribute("tipoBola");

          // SE A BOLA ANTERIOR FOR RAINHA ENTAO DEVE CONTINUAR SENDO APOS O MOVIMENTO
          if (box[x].getAttribute("rainha") == 1) {
            box[i].setAttribute("rainha", 1);
            if (bolaAnterior == "claras") {
              box[
                i
              ].innerHTML = `<div class="${bolaAnterior} rainhaClara"></div>`;
            } else if (bolaAnterior == "escuras") {
              box[
                i
              ].innerHTML = `<div class="${bolaAnterior} rainhaEscura"></div>`;
            }
          } else {
            box[i].innerHTML = `<div class="${bolaAnterior}"></div>`;
          }

          box[x].removeAttribute("rainha");
        }
      }

      // GERAR NOVA BOLA
      box[i].setAttribute("tipoBola", bolaAnterior);
      box[i].setAttribute("temBola", 1);

      // CASO O JOGADOR NAO TENHA NENHUM ATAQUE DISPONIVEL APOS A JOGADA, A VEZ PASSA PARA O OUTRO
      if (
        jogadaDisponivel(i, nrAnterior, 1, 1) ||
        jogadaDisponivel(i, nrAnterior, -1, 1) ||
        jogadaDisponivel(i, nrAnterior, 1, -1) ||
        jogadaDisponivel(i, nrAnterior, -1, -1)
      ) {
        jogaDenovo = true;
      } else {
        // MUDAR O TIPO DE JOGADOR ==============================
        jogadorAtual = jogadorAtual == `claras` ? `escuras` : `claras`;
        jogadorContrario = jogadorContrario == `escuras` ? `claras` : `escuras`;
        jogaDenovo = false;
      }

      // SE A BOLA ATINGIR A ULTIMA LINHA OPOSTA RECEBE O TITULO DE "RAINHA" E GANHA NOVAS PROPRIEDADES

      // GERAR RAINHAS  ========================================================

      if (box[i].getAttribute("tipoBola") == "claras" && i < 8) {
        box[i].setAttribute("rainha", 1);
        box[i].innerHTML = `<div class="${bolaAnterior} rainhaClara"></div>`;
      }

      if (box[i].getAttribute("tipoBola") == "escuras" && i > 55) {
        box[i].setAttribute("rainha", 1);
        box[i].innerHTML = `<div class="${bolaAnterior} rainhaEscura"></div>`;
      }
    }

    // DESBLOQUEAR TODAS BOLAS BLOQUEADAS PELA REGRA DO ATAQUE OBRIGATORIO
    for (let i = 0; i < box.length; i++) {
      if (box[i].getAttribute("tipoBola") == jogadorAtual) {
        box[i].setAttribute("bloqueado", 0);
      }
    }
  }

  // ===============================================================================================================================================

  function limpaCores() {
    for (let i = 0; i < box.length; i++) {
      box[i].style.borderColor = "";
    }
  }

  // ===============================================================================================================================================

  // UMA DAS FUNCOES MAIS IMPORTANTES
  function geraCores(i) {
    for (let a in lista) {
      for (let b in lista[0]) {
        // MULTIPLICAR POR 1 PARA CONVERTER PRA NR.
        a *= 1;
        b *= 1;

        if (
          box[i] == lista[a][b] &&
          box[i].getAttribute("tipoDeQuadrado") == "preto" &&
          box[i].getAttribute("temBola") == 1 &&
          box[i].getAttribute("bloqueado") != 1 &&
          box[i].getAttribute("tipoBola") != jogadorContrario
        ) {
          box[i].style.borderColor = "yellow";

          gerarVerde(i, "claras", -1, -1);
          gerarVerde(i, "claras", -1, 1);
          gerarVerde(i, "escuras", 1, -1);
          gerarVerde(i, "escuras", 1, 1);

          if (box[i].getAttribute("rainha") == 1) {
            // DEFINICOES DE CORES PARA DADOS "RAINHA"
            moverRainha(i, -1, -1);
            moverRainha(i, 1, -1);
            moverRainha(i, -1, 1);
            moverRainha(i, 1, 1);
          }

          // DEPOIS DE SE CRIAR ESPACOS VERDES, EM CASO DE HOUVER NO MINIMO UMA BOLA OPOSTA VUNERAVEL SERA NECESSARIO AVALIAR AS DIAGONAIS A PARTIR DOS PONTOS VERDES PARA VERIFICAR A POSSIBILIDADE DE ATACAR OUTRAS EM DIAGONAIS DIFERENTES. OU SEJA, ESCANEAR TODAS AS BOLAS, SE TIVER NO MINIMO UMA VERMELHA, VERIFICAR AS DIAGONAIS DISPONIVEIS DE TODOS ESPACOS VERDES
        }

        // MANTER A FUNCAO "gerarVerde" DENTRO DA "geraCores" POR CAUSA DAS VARIAVEIS a E b
        function gerarVerde(i, bola, linha, coluna) {
          // USAR TRATAMENTO DE ERROS PARA CASOS EM QUE AS OPCOES SE ENCONTRAM FORA DO TABULEIRO

          //AS BOLAS SO AVANCAM EM DIRECAO AS OPOSTAS, NAO PODEM SE MOVIMENTAR PARA TRAS EXCEPTO EM CASO DE TIVER QUE ATACAR UMA OPOSTA LOGO IMEDIATA, ENTAO A OPCAO DE GERAR ESPACOS VERDES IMEDIATOS SERA CONDICIONADA CONFORME A COR, MAS A FUNCAO "ESCANEAR_DIAGONAL" NAO SERA POR CAUSA DO ATAQUE

          let s1 = linha;
          let s2 = coluna;

          try {
            if (
              box[i].getAttribute("tipoBola") == bola &&
              lista[a + s1][b + s2].getAttribute("temBola") != 1
            ) {
              lista[a + s1][b + s2].style.borderColor = "green";
            }
            escanearDiagonais(i, s1, s2);
          } catch (error) {}
        }
      }
    }
  }

  // ===============================================================================================================================================

  function apagarBolas(i) {
    escanearApagar(i, -1, -1);
    escanearApagar(i, 1, -1);
    escanearApagar(i, -1, 1);
    escanearApagar(i, 1, 1);
  }
  // ===============================================================================================================================================

  function jogadaDisponivel(i, x, linha, coluna) {
    let s1 = linha;
    let s2 = coluna;

    try {
      for (let a in lista) {
        for (let b in lista[0]) {
          a *= 1;
          b *= 1;
          if (box[i] == lista[a][b]) {
            if (
              box[x] != lista[a - 1][b - 1] &&
              box[x] != lista[a + 1][b + 1] &&
              box[x] != lista[a + 1][b - 1] &&
              box[x] != lista[a - 1][b + 1]
            ) {
              if (
                lista[a + 1 * s1][b + 1 * s2].getAttribute("temBola") == 1 &&
                lista[a + 1 * s1][b + 1 * s2].getAttribute("tipoBola") !=
                  lista[a][b].getAttribute("tipoBola") &&
                lista[a + 2 * s1][b + 2 * s2].getAttribute("temBola") != 1
              ) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }
    } catch (error) {}
  }
  // ===============================================================================================================================================

  function escanearDiagonais(i, linha, coluna) {
    //SINAL PARA DETERMINAR SE A LINHA OU COLUNA SERA POSITIVA OU NEGATIVA
    let s1 = linha;
    let s2 = coluna;
    let caixaAmarela;

    // PROCURAR A CAIXA COM COR AMARELA PARA O SCAN SE BASEAR NELA, EVITANDO QUE BOLAS DO MESMO TIPO SE MARQUEM COM VERMELHO
    for (let i = 0; i < box.length; i++) {
      if (box[i].style.borderColor == "yellow") {
        caixaAmarela = i;
      }
    }

    try {
      for (let a in lista) {
        for (let b in lista[0]) {
          a *= 1;
          b *= 1;
          if (box[i] == lista[a][b]) {
            let pos = 1;

            while (
              lista[a + pos * s1][b + pos * s2].getAttribute("temBola") == 1 &&
              lista[a + pos * s1][b + pos * s2].getAttribute("tipoBola") !=
                box[caixaAmarela].getAttribute("tipoBola") &&
              lista[a + (pos + 1) * s1][b + (pos + 1) * s2].getAttribute(
                "temBola"
              ) != 1
            ) {
              lista[a + (pos + 1) * s1][b + (pos + 1) * s2].style.borderColor =
                "green";
              lista[a + pos * s1][b + pos * s2].style.borderColor = "red";
              achouVuneravel = true;
              pos += 2;
            }
          }
        }
      }
    } catch (error) {}
  }

  // ===============================================================================================================================================

  function moverRainha(i, linha, coluna) {
    //SINAL PARA DETERMINAR SE A LINHA OU COLUNA SERA NEGATIVA OU POSITIVA
    let s1 = linha;
    let s2 = coluna;

    try {
      for (let a in lista) {
        for (let b in lista[0]) {
          a *= 1;
          b *= 1;
          if (box[i] == lista[a][b]) {
            let pos = 1;

            while (
              lista[a + pos * s1][b + pos * s2].getAttribute("temBola") != 1
            ) {
              lista[a + pos * s1][b + pos * s2].style.borderColor = "green";
              pos++;
            }

            if (
              lista[a + pos * s1][b + pos * s2].getAttribute("temBola") == 1 &&
              lista[a + pos * s1][b + pos * s2].getAttribute("tipoBola") !=
                lista[a][b].getAttribute("tipoBola") &&
              lista[a + (pos + 1) * s1][b + (pos + 1) * s2].getAttribute(
                "temBola"
              ) != 1
            ) {
              lista[a + (pos + 1) * s1][b + (pos + 1) * s2].style.borderColor =
                "green";
              lista[a + pos * s1][b + pos * s2].style.borderColor = "red";
            }
          }
        }
      }
    } catch (error) {}
  }

  // ===============================================================================================================================================

  function escanearApagar(i, linha, coluna) {
    //SINAL PARA DETERMINAR SE A LINHA OU COLUNA SERA NEGATIVA OU POSITIVA
    let s1 = linha;
    let s2 = coluna;

    for (let a in lista) {
      for (let b in lista[0]) {
        // MULTIPLICAR POR 1 PARA CONVERTER PRA NR.
        a *= 1;
        b *= 1;
        if (box[i] == lista[a][b]) {
          // VERIFICAR SE TEM AMARELO ANTES DE LIMPAR AS BOLAS PARA EVITAR APAGAR EM TODAS DIAGONAIS A PARTIR DO ESCOLHIDO
          try {
            let ca = 1;
            let cb = 1;
            let temAmarelo = false;
            while (cb < 8) {
              if (
                lista[a + cb * s1][b + cb * s2].style.borderColor == "yellow"
              ) {
                temAmarelo = true;
                break;
              }
              cb++;
            }

            if (temAmarelo) {
              while (
                lista[a + ca * s1][b + ca * s2].style.borderColor != "yellow"
              ) {
                if (ca >= 8) {
                  //8 E O NR. MAX DE QUADRADOS NUMA DIAGONAL
                  break;
                }
                lista[a + ca * s1][b + ca * s2].innerHTML = "";
                lista[a + ca * s1][b + ca * s2].setAttribute("temBola", 0);
                lista[a + ca * s1][b + ca * s2].removeAttribute("tipoBola");
                lista[a + ca * s1][b + ca * s2].removeAttribute("rainha");
                ca++;
              }
            }
          } catch (error) {}
        }
      }
    }
  }

  // ===============================================================================================================================================

  function ataqueObrigatorio() {
    for (let a in lista) {
      for (let b in lista[0]) {
        a *= 1;
        b *= 1;
        // PROCURAR ID DA BOX AMARELA NA LISTA
        try {
          if (lista[a][b].style.borderColor == "yellow") {
            if (
              // SE TIVER PELO MENOS UM VERMELHO, TODOS MOVIMENTOS SEM ATAQUES DEVEM SER BLOQUEADOS, OBRIGANDO O JOGADOR A ATACAR
              lista[a - 1][b - 1].style.borderColor == "red" ||
              lista[a - 1][b + 1].style.borderColor == "red" ||
              lista[a + 1][b - 1].style.borderColor == "red" ||
              lista[a + 1][b + 1].style.borderColor == "red"
            ) {
              if (lista[a - 1][b - 1].style.borderColor == "green") {
                lista[a - 1][b - 1].style.borderColor = "";
              }
              if (lista[a - 1][b + 1].style.borderColor == "green") {
                lista[a - 1][b + 1].style.borderColor = "";
              }
              if (lista[a + 1][b - 1].style.borderColor == "green") {
                lista[a + 1][b - 1].style.borderColor = "";
              }
              if (lista[a + 1][b + 1].style.borderColor == "green") {
                lista[a + 1][b + 1].style.borderColor = "";
              }
            }
          }
        } catch (error) {}
      }
    }
  }

  // ===============================================================================================================================================

  function trancar(tipo) {
    // SE PELO MENOS UMA BOLA PODE ATACAR, ENTAO TRANCA TODAS AS QUE NAO PODEM. DEIXANDO LIVRE OUTRAS QUE PODEM.

    // ATIVAR AS CORES DE TODOS DADOS
    for (let i = 0; i < box.length; i++) {
      if (
        box[i].getAttribute("temBola") == 1 &&
        box[i].getAttribute("tipoBola") == tipo
      ) {
        geraCores(i);
      }
    }

    // PROCURAR SE TEM PELO MENOS UM VERMELHO
    let vermelhoAchado = false;

    for (let i = 0; i < box.length; i++) {
      if (box[i].style.borderColor == "red") {
        vermelhoAchado = true;
      }
    }

    if (vermelhoAchado) {
      vermelhoAchado = false;

      let dadoLivre = 0;

      for (let a in lista) {
        for (let b in lista[0]) {
          a *= 1;
          b *= 1;

          if (lista[a][b].style.borderColor == "yellow") {
            if (lista[a][b].getAttribute("rainha") == 1) {
              dadoLivre = verificarRainha(-1, -1);
              dadoLivre = verificarRainha(1, -1);
              dadoLivre = verificarRainha(-1, 1);
              dadoLivre = verificarRainha(1, 1);
            } else {
              try {
                if (
                  lista[a - 1][b - 1].getAttribute("temBola") == 1 &&
                  lista[a - 1][b - 1].getAttribute("tipoBola") !=
                    lista[a][b].getAttribute("tipoBola") &&
                  lista[a - 2][b - 2].getAttribute("temBola") != 1
                ) {
                  dadoLivre++;
                }
              } catch (error) {}
              try {
                if (
                  lista[a - 1][b + 1].getAttribute("temBola") == 1 &&
                  lista[a - 1][b + 1].getAttribute("tipoBola") !=
                    lista[a][b].getAttribute("tipoBola") &&
                  lista[a - 2][b + 2].getAttribute("temBola") != 1
                ) {
                  dadoLivre++;
                }
              } catch (error) {}

              try {
                if (
                  lista[a + 1][b - 1].getAttribute("temBola") == 1 &&
                  lista[a + 1][b - 1].getAttribute("tipoBola") !=
                    lista[a][b].getAttribute("tipoBola") &&
                  lista[a + 2][b - 2].getAttribute("temBola") != 1
                ) {
                  dadoLivre++;
                }
              } catch (error) {}

              try {
                if (
                  lista[a + 1][b + 1].getAttribute("temBola") == 1 &&
                  lista[a + 1][b + 1].getAttribute("tipoBola") !=
                    lista[a][b].getAttribute("tipoBola") &&
                  lista[a + 2][b + 2].getAttribute("temBola") != 1
                ) {
                  dadoLivre++;
                }
              } catch (error) {}
            }

            // SE TIVER PELO MENOS UM VERMELHO FICA LIVRE E OS OUTROS FICAM BLOQUEADOS

            // BLOQUEAR TODOS COM O ATRIBUTO "bloqueado"
            if (dadoLivre == 0) lista[a][b].setAttribute("bloqueado", 1);

            dadoLivre = 0;
          }
        }
      }
    }

    limpaCores();
  }

  // ===============================================================================================================================================

  function verificarRainha(linha, coluna) {
    //SINAL PARA DETERMINAR SE A LINHA OU COLUNA SERA NEGATIVA OU POSITIVA
    let s1 = linha;
    let s2 = coluna;

    try {
      for (let a in lista) {
        for (let b in lista[0]) {
          a *= 1;
          b *= 1;
          if (
            lista[a][b].style.borderColor == "yellow" &&
            lista[a][b].getAttribute("rainha") == 1
          ) {
            let pos = 1;

            while (
              lista[a + pos * s1][b + pos * s2].getAttribute("temBola") != 1
            ) {
              pos++;
            }

            if (
              lista[a + pos * s1][b + pos * s2].getAttribute("temBola") == 1 &&
              lista[a + pos * s1][b + pos * s2].getAttribute("tipoBola") !=
                lista[a][b].getAttribute("tipoBola") &&
              lista[a + (pos + 1) * s1][b + (pos + 1) * s2].getAttribute(
                "temBola"
              ) != 1
            ) {
              return 1;
            }
          }
        }
      }
    } catch (error) {}
  }
};
