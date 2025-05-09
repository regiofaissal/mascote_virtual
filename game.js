class MascoteVirtual {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.fome = 100;
        this.felicidade = 100;
        this.energia = 100;
        this.acordado = true;
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.direcao = 1;
        this.pulando = false;
        this.alturaPulo = 0;
        this.velocidadePulo = 0;
        this.alturaMaximaPulo = 30;
        this.comendo = false;
        this.brincando = false;
        

        this.sons = {
            comer: new Audio('sons/comer.wav'),
            pular: new Audio('sons/pular.wav'),
            brincar: new Audio('sons/brincar.wav'),
            dormir: new Audio('sons/dormir.wav'),
            acordar: new Audio('sons/acordar.wav')
        };

        this.sons.comer.volume = 0.9;  // 50% do volume
        this.sons.pular.volume = 0.7;  // 30% do volume
        this.sons.brincar.volume = 0.7;  // 40% do volume
        this.sons.dormir.volume = 0.5;  // 30% do volume
        this.sons.acordar.volume = 0.3;  // 50% do volume

        this.cores = {
            corpo: '#FF9800',
            corpoAdormecido: '#78909C',
            orelhas: '#FFB74D',
            olhos: '#2196F3',
            nariz: '#E91E63',
            comida: '#8BC34A',
            bola: '#9C27B0'
        };

        this.icones = {
            alimentar: new Image(),
            brincar: new Image(),
            dormir: new Image()
        };
    
        this.icones.alimentar.src = 'imagens/comida.png';
        this.icones.brincar.src = 'imagens/bola.png';
        this.icones.dormir.src = 'imagens/dormir.png';
    
        this.botoes = {
            alimentar: { x: 50, y: 350, width: 80, height: 30, texto: 'Alimentar', icone: this.icones.alimentar },
            brincar: { x: 160, y: 350, width: 80, height: 30, texto: 'Brincar', icone: this.icones.brincar },
            dormir: { x: 270, y: 350, width: 80, height: 30, texto: 'Dormir', icone: this.icones.dormir }
        };

        this.nuvens = [
            { x: 50, y: 50, tamanho: 40, velocidade: 0.3 },
            { x: 150, y: 80, tamanho: 60, velocidade: 0.2 },
            { x: 300, y: 40, tamanho: 50, velocidade: 0.4 }
        ];

        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.iniciarAnimacao();
        setInterval(() => this.atualizarStatus(), 300);

       
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let [acao, botao] of Object.entries(this.botoes)) {
            if (x >= botao.x && x <= botao.x + botao.width &&
                y >= botao.y && y <= botao.y + botao.height) {
                if (acao === 'alimentar') alimentar();
                if (acao === 'brincar') brincar();
                if (acao === 'dormir') dormir();
            }
        }
    }

    desenharInterface() {
        this.desenharBarraStatus('🍖 Fome', this.fome, 20, 20, '#FF5722');
        this.desenharBarraStatus('⚽ Feliz', this.felicidade, 20, 50, '#4CAF50');
        this.desenharBarraStatus('⚡ Energia', this.energia, 20, 80, '#2196F3');

        for (let botao of Object.values(this.botoes)) {
            // this.ctx.fillStyle = '#3F51B5';
            // this.ctx.strokeStyle = '#303F9F';
            // this.ctx.lineWidth = 2;
            
            // this.ctx.beginPath();
            // this.ctx.roundRect(botao.x, botao.y, botao.width, botao.height, 5);
            // this.ctx.fill();
            // this.ctx.stroke();

            // this.ctx.fillStyle = 'white';
            // this.ctx.font = '14px Arial';
            // this.ctx.textAlign = 'center';
            // this.ctx.textBaseline = 'middle';
            // this.ctx.fillText(botao.texto, botao.x + botao.width/2, botao.y + botao.height/2);

            const tamanhoIcone = 50;
            const margemIcone = 20;
            this.ctx.drawImage(botao.icone, 
            botao.x + margemIcone, 
            botao.y + (botao.height - tamanhoIcone) / 2, 
            tamanhoIcone, 
            tamanhoIcone);

        // // Desenhar texto
        //     this.ctx.fillStyle = 'white';
        //     this.ctx.font = '14px Arial';
        //     this.ctx.textAlign = 'left';
        //     this.ctx.textBaseline = 'middle';
        //     this.ctx.fillText(botao.texto, 
        //     botao.x + tamanhoIcone + margemIcone * 2, 
        //     botao.y + botao.height/2);
        }
    }

    desenharBarraStatus(texto, valor, x, y, cor) {
        const larguraMaxima = 150;
        const altura = 20;

        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(texto, x, y + altura/2);

        this.ctx.fillStyle = '#EEE';
        this.ctx.beginPath();
        this.ctx.roundRect(x + 70, y, larguraMaxima, altura, 5);
        this.ctx.fill();

        this.ctx.fillStyle = cor;
        this.ctx.beginPath();
        this.ctx.roundRect(x + 70, y, (larguraMaxima * valor) / 100, altura, 5);
        this.ctx.fill();
    }

    iniciarAnimacao() {
        const animar = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.desenharFundo();
            this.desenharNuvens();
            this.atualizarPulo();
            this.desenharMascote();
            this.desenharInterface();
            requestAnimationFrame(animar);
        };
        animar();
    }

    atualizarPulo() {
        if (this.pulando) {
            this.velocidadePulo += 0.6;
            this.alturaPulo -= this.velocidadePulo;
            
            if (this.alturaPulo <= 0) {
                this.alturaPulo = 0;
                this.velocidadePulo = 0;
                this.pulando = false;
            }
        }
    }

    pular() {
        if (!this.pulando && this.acordado) {
            this.pulando = true;
            this.alturaPulo = this.alturaMaximaPulo;
            this.velocidadePulo = -4;
            this.sons.pular.play();
        }
    }

    desenharFundo() {
        const gradiente = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradiente.addColorStop(0, '#87CEEB');
        gradiente.addColorStop(1, '#E0F7FA');
        this.ctx.fillStyle = gradiente;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const gramaGradiente = this.ctx.createLinearGradient(0, this.canvas.height - 100, 0, this.canvas.height);
        gramaGradiente.addColorStop(0, '#90EE90');
        gramaGradiente.addColorStop(1, '#32CD32');
        this.ctx.fillStyle = gramaGradiente;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height - 80);
        this.ctx.quadraticCurveTo(this.canvas.width/2, this.canvas.height - 100, 
                                 this.canvas.width, this.canvas.height - 80);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.fill();
    }

    desenharNuvens() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        for (let nuvem of this.nuvens) {
            this.ctx.beginPath();
            this.ctx.arc(nuvem.x, nuvem.y, nuvem.tamanho, 0, Math.PI * 2);
            this.ctx.arc(nuvem.x + nuvem.tamanho * 0.5, nuvem.y - nuvem.tamanho * 0.2, 
                        nuvem.tamanho * 0.7, 0, Math.PI * 2);
            this.ctx.arc(nuvem.x - nuvem.tamanho * 0.5, nuvem.y - nuvem.tamanho * 0.2, 
                        nuvem.tamanho * 0.7, 0, Math.PI * 2);
            this.ctx.fill();

            nuvem.x += nuvem.velocidade;
            if (nuvem.x > this.canvas.width + nuvem.tamanho * 2) {
                nuvem.x = -nuvem.tamanho * 2;
            }
        }
    }

    desenharMascote() {
        let posicaoY = this.y - this.alturaPulo;

        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 5;

        // Corpo
        this.ctx.fillStyle = this.acordado ? this.cores.corpo : this.cores.corpoAdormecido;
        this.ctx.beginPath();
        this.ctx.arc(this.x, posicaoY, 50, 0, Math.PI * 2);
        this.ctx.fill();

        // Orelhas
        const gradienteOrelha = this.ctx.createLinearGradient(this.x - 30, posicaoY - 50, this.x - 30, posicaoY - 25);
        gradienteOrelha.addColorStop(0, this.cores.orelhas);
        gradienteOrelha.addColorStop(1, this.cores.corpo);

        this.ctx.fillStyle = gradienteOrelha;
        this.ctx.beginPath();
        this.ctx.ellipse(this.x - 30, posicaoY - 50, 15, 25, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(this.x + 30, posicaoY - 50, 15, 25, -Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Olhos
        if (this.acordado) {
            this.ctx.fillStyle = this.cores.olhos;
            this.ctx.beginPath();
            this.ctx.arc(this.x - 15, posicaoY - 10, 6, 0, Math.PI * 2);
            this.ctx.arc(this.x + 15, posicaoY - 10, 6, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(this.x - 17, posicaoY - 12, 2, 0, Math.PI * 2);
            this.ctx.arc(this.x + 13, posicaoY - 12, 2, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = '#455A64';
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(this.x - 20, posicaoY - 10);
            this.ctx.lineTo(this.x - 10, posicaoY - 10);
            this.ctx.moveTo(this.x + 10, posicaoY - 10);
            this.ctx.lineTo(this.x + 20, posicaoY - 10);
            this.ctx.stroke();
        }

        // Nariz
        const gradienteNariz = this.ctx.createRadialGradient(
            this.x, posicaoY + 10, 2,
            this.x, posicaoY + 10, 5
        );
        gradienteNariz.addColorStop(0, this.cores.nariz);
        gradienteNariz.addColorStop(1, '#C2185B');
        
        this.ctx.fillStyle = gradienteNariz;
        this.ctx.beginPath();
        this.ctx.arc(this.x, posicaoY + 10, 5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;

        if (this.comendo) {
            this.desenharComida(posicaoY);
        }
        if (this.brincando) {
            this.desenharBola(posicaoY);
        }
    }

    desenharComida(posicaoY) {
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = this.cores.comida;
        this.ctx.beginPath();
        this.ctx.roundRect(this.x - 40, posicaoY + 40, 20, 20, 5);
        this.ctx.fill();
        this.ctx.shadowColor = 'transparent';
    }

    desenharBola(posicaoY) {
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = this.cores.bola;
        this.ctx.beginPath();
        this.ctx.arc(this.x + 40, posicaoY + 40, 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(this.x + 37, posicaoY + 37, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowColor = 'transparent';
    }

    atualizarStatus() {
        if (this.acordado) {
            this.fome = Math.max(0, this.fome - 0.2);
            this.felicidade = Math.max(0, this.felicidade - 0.1);
            this.energia = Math.max(0, this.energia - 0.1);
            
            if (!this.comendo && !this.brincando && !this.pulando) {
                if (Math.random() < 0.25) {
                    this.x += (Math.random() - 0.5) * 25;
                    this.y += (Math.random() - 0.5) * 25;
                    this.x = Math.max(50, Math.min(this.canvas.width - 50, this.x));
                    this.y = Math.max(50, Math.min(this.canvas.height - 50, this.y));
                }
            }
        } else {
            this.energia = Math.min(100, this.energia + 2);
        }
    }
}

const mascote = new MascoteVirtual();

function alimentar() {
    if (mascote.acordado && !mascote.comendo && !mascote.brincando) {
        mascote.comendo = true;
        mascote.pular();
        mascote.sons.comer.play();
        setTimeout(() => {
            mascote.comendo = false;
            mascote.fome = Math.min(100, mascote.fome + 30);
            mascote.felicidade = Math.min(100, mascote.felicidade + 10);
        }, 1000);
    }
}

function brincar() {
    if (mascote.acordado && mascote.energia > 20 && !mascote.comendo && !mascote.brincando) {
        mascote.brincando = true;
        mascote.pular();
        mascote.sons.brincar.play();
        setTimeout(() => {
            mascote.brincando = false;
            mascote.felicidade = Math.min(100, mascote.felicidade + 30);
            mascote.energia = Math.max(0, mascote.energia - 20);
            mascote.fome = Math.max(0, mascote.fome - 10);
        }, 1500);
    }
}

function dormir() {
    mascote.acordado = !mascote.acordado;
    mascote.comendo = false;
    mascote.brincando = false;
    mascote.pulando = false;

    if (mascote.acordado) {
        mascote.sons.acordar.play(); 
    }
    else {
        mascote.sons.dormir.play(); 
    }
}