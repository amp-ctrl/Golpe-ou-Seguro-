# Consumo Impulsivo e Golpes Digitais

Jogo educativo de faculdade: **Treine para não cair**. Leia uma mensagem simulada, decida entre Golpe e Segura e confira o contexto, os sinais e como verificar. As marcas, personagens, endereços e valores dos cenários são fictícios; os domínios usam `.example` e os textos não abrem links.

## Rodar

Validado com Node.js 24 e npm 11. Sem dependências de runtime além de React e React DOM.

```sh
npm install && npm run dev
```

No Windows PowerShell 5, execute em duas linhas:

```powershell
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite no terminal.

```sh
npm run build
npm run preview
npm test
```

O build executa `tsc -b && vite build`. O comando de testes executa o Vitest uma vez, sem modo de observação. Vitest é a única dependência de desenvolvimento acrescentada nas três fases.

## Jogar

- Escolha 10, 15 ou 20 questões. O treino termina depois da explicação da última resposta; Encerrar gera um resultado parcial.
- No jogo, G marca Golpe, S marca Segura e Enter avança depois da resposta. O botão Desativar G/S permite desligar os atalhos de letras durante a partida. Enter conserva o comportamento dos botões e acordeões quando eles estão focados.
- Após responder, os trechos literais recebem sublinhado. Em golpes, os destaques usam tom de alerta; nas legítimas, o sublinhado é neutro. Antes da resposta, os mockups não recebem destaques ou selos de classificação.
- O resultado separa golpes aceitos como seguros de mensagens legítimas rejeitadas. Abra a revisão de cada resposta para reler o mockup, contexto, explicação, sinais e verificação.
- Copiar meu resultado usa o clipboard somente após o clique. Se o navegador recusar, o jogo oferece um campo selecionável para cópia manual.

## Banco e sorteio

O banco contém 60 questões: 35 golpes e 25 legítimas, 15 por canal, em 17 categorias e 24 tipos de golpe. As dificuldades são 18 fáceis, 24 médias e 18 difíceis. Os números da home são calculados do banco.

O sorteador não repete questão dentro de uma partida e mantém:

- Até duas mensagens seguidas do mesmo canal.
- Até três seguidas com a mesma resposta.
- Categorias diferentes em questões consecutivas.
- Entre 40% e 60% de golpes.
- Uma curva de dificuldade crescente, com aproximadamente 30% de nível 1, 40% de nível 2 e o restante de nível 3.
- Sorteio ponderado para favorecer questões menos vistas nas três partidas recentes, considerando apenas as efetivamente exibidas.
- Uma primeira questão diferente das primeiras das três partidas recentes e da última questão exibida. A combinação canal/categoria também difere da abertura e do encerramento da partida anterior.

`buildSession` aceita um seed para reproduzir sorteios em testes. Não lê armazenamento nem altera as entradas.

O treino focado aumenta a prioridade das até duas categorias com mais erros na partida recém-encerrada. O banco tem categorias pequenas ou sem diversidade suficiente de respostas e dificuldades. Portanto, a partida inclui outros temas quando necessário para manter todas as regras; o cabeçalho mostra quantas questões estão nos temas escolhidos. A interface explica essa condição junto à ação.

A home sorteia cinco questões distintas por carregamento, cobrindo os quatro canais e repetindo um com outra questão, conforme a decisão da Fase 2. Mostra dois ou três golpes sem revelar o gabarito. O autoplay pausa com foco, hover, pausa manual e aba oculta; fica desligado com preferência por movimento reduzido.

## Resultado e armazenamento

Os perfis usam a proporção real de acertos, antes de arredondar o percentual exibido:

| Acerto | Perfil |
| --- | --- |
| Abaixo de 40% | Começando a observar |
| 40% a menos de 70% | Desconfiado |
| 70% a menos de 90% | Radar ligado |
| A partir de 90% | Caçador de golpes |
| Nenhuma resposta | Treino por começar, sem percentual |

Os pontos fracos são as até duas categorias com mais erros; empates usam proporção de erros e ordem alfabética. Uma partida sem erros não inventa pontos fracos. Os gráficos consideram apenas as mensagens respondidas.

`storage.ts` é a única camada que acessa localStorage. O schema atual é 2; recorde e histórico de exposição do schema 1 continuam legíveis. O prefixo antigo das chaves foi conservado para compatibilidade.

- Recorde absoluto de pontuação, inclusive de partidas encerradas antes.
- IDs exibidos nas últimas três partidas, atualizados durante o jogo.
- Dez resultados encerrados, com respostas, canal, categoria e classificação do cenário.
- Estatísticas por categoria acumuladas além da janela dos dez resultados.
- Gravação do resultado e dos totais em um único envelope, com proteção contra salvar duas vezes a mesma partida recente.
- Validação de estruturas e schema; dados inválidos retornam valores seguros.
- Fallback em memória se leitura ou gravação falhar, inclusive armazenamento cheio. Esse fallback dura enquanto a página permanece aberta.

Uma partida fechada por recarregamento antes de Encerrar não gera resultado final; os IDs já exibidos continuam no histórico de exposição. Não há sincronização entre dispositivos. Os horários do histórico são exibidos no fuso America/Sao_Paulo.

## Mapa de arquivos e mudanças

| Arquivo | Responsabilidade / mudança |
| --- | --- |
| `src/App.tsx` | Coordena início, respostas, bloqueio contra resposta duplicada, finalização única, persistência e treino focado. |
| `src/data/challenges.ts` | 60 cenários, categorias e tipos de golpe; união discriminada por canal e por classificação, sem casts de conteúdo. |
| `src/data/guidance.ts` | Nomes de canais/categorias e dicas práticas por tema. |
| `src/components/StartScreen.tsx` | Home em componentes, ações e composição das duas colunas. |
| `src/components/SessionSizePicker.tsx` | Seletor nativo de 10/15/20 questões. |
| `src/components/HowItWorks.tsx` | Três passos do treino. |
| `src/components/StatsStrip.tsx` | Números calculados do banco. |
| `src/components/ExampleCarousel.tsx` | Autoplay, pausa, visibilidade, movimento reduzido, teclado, dots e swipe. |
| `src/components/ExamplePhone.tsx` | Chassi compartilhado entre exemplo e jogo; altura por variante e retorno ao topo da mensagem. |
| `src/components/ChallengeMock.tsx` | Seleção de mock por união discriminada e ativação dos destaques somente quando solicitado. |
| `src/components/HighlightedText.tsx` | Renderiza trechos com `mark`, preservando o escape de texto do React. |
| `src/components/mocks/WhatsAppMock.tsx` | Mensagens e destaques literais de WhatsApp. |
| `src/components/mocks/SmsMock.tsx` | Mensagens e destaques literais de SMS. |
| `src/components/mocks/EmailMock.tsx` | Remetente, assunto, parágrafos e destaques de e-mail. |
| `src/components/mocks/InstagramMock.tsx` | Publicação e destaques; remoção dos selos que insinuavam legitimidade ou fraude. |
| `src/components/PlayingScreen.tsx` | Jogo com celular amplo, contexto, feedback completo, progresso e atalhos com opção de desativar G/S. |
| `src/components/QuestionExplanation.tsx` | Explicação, chips de sinais e Como confirmar, compartilhados pelo jogo e pela revisão. |
| `src/components/ResultScreen.tsx` | Placar, perfil, indicadores de erro, pontos fracos, histórico, ações, clipboard e organização do resultado. |
| `src/components/PerformanceBars.tsx` | Barras CSS com valores textuais de desempenho. |
| `src/components/ReviewList.tsx` | Revisão com mini-mockup, comparação de respostas e acordeões nativos acessíveis. |
| `src/components/SafetyGuidance.tsx` | Checklist de cinco itens e seis passos genéricos após um golpe. |
| `src/services/sessionBuilder.ts` | Sorteio puro com seed, regras obrigatórias, prioridade de exposição e de categorias do treino focado. |
| `src/services/exampleSelector.ts` | Seleção dos cinco exemplos, diversidade de canais e equilíbrio de respostas. |
| `src/services/results.ts` | Tipos, validação, contadores, perfis, pontos fracos e texto de compartilhamento. |
| `src/services/highlights.ts` | Divisão literal dos textos, com repetições e sobreposições, sem interpretar HTML. |
| `src/services/storage.ts` | Schema 2, compatibilidade, recorde, exposição, resultados, totais e fallback em memória. |
| `src/styles/index.css` | Base e mockups; remoção do CSS das antigas telas de início, desafio e resumo. |
| `src/styles/tokens.css` | Mantém as cores e fontes originais e acrescenta tokens de contraste para texto de feedback e bordas de controles. |
| `src/styles/session.css` | Seletor, progresso, ajustes de contraste e preferência por movimento reduzido. |
| `src/styles/home.css` | Layout amplo e tipografia fluida da home; celular e controles do carrossel. |
| `src/styles/training.css` | Layouts de jogo/resultado, feedback, destaques, barras, revisão e orientações. |
| `src/main.tsx` | Carrega os estilos específicos. |
| `src/data/challenges.test.ts` | Quantidade, distribuição, metadados, destaques exatos e domínios fictícios. |
| `src/services/sessionBuilder.test.ts` | 3.000 partidas comuns e 1.000 focadas, sem relaxar as regras. |
| `src/services/exampleSelector.test.ts` | Diversidade, identidade das questões, mistura de respostas e variação de seleção. |
| `src/services/storage.test.ts` | Corrupção, indisponibilidade, armazenamento cheio, migração, retenção e totais acumulados. |
| `src/services/results.test.ts` | Dois tipos de erro, totais, perfis, partidas vazias/perfeitas e compartilhamento. |
| `src/components/HighlightedText.test.tsx` | Correspondência literal, escape de HTML e apresentação neutra nas legítimas dos quatro canais. |
| `package.json` / `package-lock.json` | Script `npm test` e Vitest como devDependency. |
| `.gitignore` | Ignora novos artefatos gerados e capturas temporárias. |
| `README.md` | Execução, testes, decisões e revisão de conteúdo. |

A paleta e as famílias de fontes de `src/styles/tokens.css` foram preservadas. A pontuação continua definida em `src/config.ts`.

## Validação

A suíte contém 27 testes, com 4.000 partidas simuladas, além dos testes de conteúdo, persistência, análise e destaques. O build passa com TypeScript estrito.

A conferência no Edge incluiu 1920×1080, 1440×900 e 390×844, partidas de 10/15/20 questões, feedback, revisão por teclado, G/S/Enter e sua desativação, cópia e fallback, treino focado, finalização antecipada e vazia, persistência após recarregar e movimento reduzido. As capturas e o roteiro usados durante o desenvolvimento ficam em `.tmp`, fora do commit.

## Decisões para revisar

1. O treino focado prioriza temas, mas inclui complementos quando as restrições impedem uma partida composta só pelos pontos fracos. O botão conserva o texto solicitado; a condição aparece ao lado e o cabeçalho informa a quantidade efetiva.
2. O recorde é absoluto: partidas de 20 questões podem render mais pontos que as de 10. O percentual continua separado do placar.
3. Histórico de dez resultados e totais por categoria acumulados, com três partidas recentes para ponderar a exposição.
4. Perfis em 40/70/90%, com rótulo inicial sem julgamento pessoal; eles descrevem apenas a partida.
5. Até dois pontos fracos por número de erros, com critérios de desempate documentados acima.
6. Sinais de confiança de mensagens legítimas destacam contexto reconhecido e ausência de solicitação de credenciais a terceiros. Não equivalem a uma garantia geral de segurança.
7. O resultado pode ter rolagem vertical: o conteúdo completo inclui gráficos, revisão e orientações. As ações ficam junto ao perfil, sem fixação no rodapé.
8. Os exemplos da home mantêm cinco slides e quatro canais, com repetição de um canal aprovada na Fase 2.

## Conteúdo que precisa de revisão humana

- Revisar a linguagem natural, classificação, categoria e dificuldade das 60 questões, considerando o público da faculdade.
- Priorizar as legítimas: o gabarito depende do contexto explícito de solicitação, contratação ou confirmação independente, não só de domínio, ausência de link ou aparência. Conferir especialmente `ch-07` a `ch-10`, `ch-17` a `ch-22` e `ch-43` a `ch-47`.
- Nos cenários sutis (`ch-13`, `ch-15`, `ch-16`, `ch-26`, `ch-29`, `ch-36`, `ch-39`, `ch-42`, `ch-50` e `ch-53`), confirmar se os sinais fornecidos bastam para sustentar o gabarito sem adivinhação.
- Revisar a distinção entre comprovante, crédito em conta e devolução da transação original nos cenários de Pix (`ch-11`, `ch-12`, `ch-20` e `ch-22`).
- Revisar o grau de realismo dos serviços fictícios de documentos e tributos (`ch-23`, `ch-32`, `ch-39` e `ch-47`), sem sugerir vínculo com um órgão real.
- Validar as dicas por categoria, as frases dos perfis e os dois custos de erro com a proposta pedagógica do trabalho.
- Revisar periodicamente o bloco pós-golpe. Ele evita telefones, prazos e promessas de restituição, pois procedimentos e condições podem mudar.
- Fazer uma leitura com teclado, leitor de tela e pessoas do público-alvo; a conferência automatizada não substitui essa avaliação pedagógica e de uso.

## Referências de apoio à revisão

Consultadas em 17/11/2026. Os links abaixo são referências de documentação, fora das mensagens fictícias do jogo.

- [Banco Central: o que fazer em caso de golpe, fraude ou crime](https://www.bcb.gov.br/meubc/faqs/p/o-que-fazer-em-caso-de-golpe-fraude-ou-um-crime): comunicar o banco e solicitar análise de devolução pelo MED.
- [Ministério da Justiça: caí no golpe do falso Pix](https://www.gov.br/mj/pt-br/acesso-a-informacao/acoes-e-programas/sofri-um-golpe-e-agora/cai-no-golpe-do-falso-pix): contato imediato por canal oficial, preservação de provas e ausência de garantia de restituição.
- [Polícia Civil do Paraná: orientações sobre golpes digitais](https://www.policiacivil.pr.gov.br/ndrcc): proteção de contas, senhas e aviso aos contatos em falsa identidade.
