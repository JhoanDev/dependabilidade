
set -e

echo "📦 Atualizando pacotes..."
sudo apt-get update && sudo apt-get upgrade -y

echo "🐍 Instalando dependências do Python e do Flask..."
sudo apt-get install -y python3-pip python3-dev curl unzip

echo "🐳 Instalando Docker..."
sudo apt-get install -y docker.io

echo "🧰 Instalando AWS CLI (v2)..."
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip aws

echo "👤 Adicionando usuário ao grupo docker..."
sudo usermod -aG docker $USER

echo "📂 Criando estrutura do projeto..."
mkdir -p ~/jhoan-app
cd ~/jhoan-app

# Instalando dependências do Flask diretamente
echo "📥 Instalando dependências do Flask..."
pip3 install flask

# Criando o arquivo Flask app.py
echo "🐍 Criando o app Flask..."
cat > app.py <<EOF
from flask import Flask, render_template_string
from datetime import datetime
import socket

app = Flask(__name__)

# Função para obter o IP privado
def get_private_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))  # Conecta-se ao Google DNS
        ip = s.getsockname()[0]  # Obtém o IP privado
        s.close()  # Fecha o socket
        return ip
    except Exception as e:
        return f"Erro ao obter IP privado: {e}"

@app.route('/')
def index():
    ip = get_private_ip()  # Pega o IP privado
    current_time = datetime.now().strftime("%m/%d/%Y %H:%M:%S")  # Pega a data e hora atual
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>App do JHOAN</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            .info {{ background: #f0f8ff; padding: 15px; border-radius: 8px; }}
        </style>
    </head>
    <body>
        <div class="info">
            <p><strong>Nome:</strong> JHOAN</p>
            <p><strong>IP Privado:</strong> {ip}</p>
            <p><strong>Data/Hora:</strong> {current_time}</p>
        </div>
        <script>
            function updateTime() {{
                const now = new Date();
                document.getElementById('datetime').textContent = 
                    now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
            }}
            updateTime();
            setInterval(updateTime, 1000);
        </script>
    </body>
    </html>
    """
    return render_template_string(html_content)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)  # Expondo o app na porta 80
EOF

echo "🔐 Configurando credenciais AWS..."
mkdir -p ~/.aws
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id=$AWS_ACCESS_KEY_ID
aws_secret_access_key=$AWS_SECRET_ACCESS_KEY
aws_session_token=$AWS_SESSION_TOKEN
EOF

echo "🛠️ Criando repositório ECR (ignorando se já existir)..."
aws ecr create-repository --repository-name $REPO_NAME --region $AWS_REGION || true

echo "🔐 Autenticando no ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "🔧 Build da imagem..."
docker build -t $IMAGE_NAME .

echo "🏷️ Tag da imagem..."
docker tag $IMAGE_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

echo "📤 Enviando imagem para o ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

echo "🧹 Limpando container antigo, se houver..."
docker stop $(docker ps -q --filter ancestor=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest) 2>/dev/null || true
docker rm $(docker ps -a -q --filter ancestor=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest) 2>/dev/null || true

echo "🚀 Subindo novo container localmente..."
docker run -d -p 80:80 $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

echo "✅ Deploy concluído!"
echo "🌐 Acesse: http://<IP_PUBLICO_DA_EC2> (libere porta 80 no Security Group)"
