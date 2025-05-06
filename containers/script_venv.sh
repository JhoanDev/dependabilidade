#!/bin/bash
set -e

echo "📁 Criando estrutura do projeto..."
mkdir -p ~/jhoan-app
cd ~/jhoan-app

echo "📥 Instalando Flask no ambiente virtual..."
pip install flask  # Esse não precisa de sudo pois deve rodar dentro do venv

echo "🐍 Criando o app Flask..."
cat > app.py <<EOF
from flask import Flask, render_template_string
from datetime import datetime
import socket

app = Flask(__name__)

def get_private_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception as e:
        return f"Erro ao obter IP: {e}"

@app.route('/')
def index():
    ip = get_private_ip()
    current_time = datetime.now().strftime("%m/%d/%Y %H:%M:%S")
    html = f\"\"\"
    <html><head><title>JHOAN APP</title></head>
    <body>
    <p><strong>Nome:</strong> JHOAN</p>
    <p><strong>IP:</strong> {ip}</p>
    <p><strong>Data/Hora:</strong> {current_time}</p>
    </body></html>
    \"\"\"
    return render_template_string(html)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
EOF

echo "🐳 Criando Dockerfile..."
cat > Dockerfile <<EOF
FROM python:3.9-slim
WORKDIR /app
COPY app.py /app
RUN pip install flask
CMD ["python", "app.py"]
EOF

echo "🔐 Configurando credenciais AWS..."
mkdir -p ~/.aws
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id=$AWS_ACCESS_KEY_ID
aws_secret_access_key=$AWS_SECRET_ACCESS_KEY
aws_session_token=$AWS_SESSION_TOKEN
EOF

echo "🛠️ Criando repositório ECR..."
aws ecr create-repository --repository-name $REPO_NAME --region $AWS_REGION || true

echo "🔐 Autenticando no ECR..."
aws ecr get-login-password --region $AWS_REGION | \
    sudo docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "🔧 Build da imagem Docker..."
sudo docker build -t $IMAGE_NAME .

echo "🏷️ Tag da imagem para ECR..."
sudo docker tag $IMAGE_NAME:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

echo "📤 Enviando imagem para o ECR..."
sudo docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

echo "🧹 Limpando containers antigos..."
sudo docker stop $(sudo docker ps -q --filter ancestor=$IMAGE_NAME) 2>/dev/null || true
sudo docker rm $(sudo docker ps -a -q --filter ancestor=$IMAGE_NAME) 2>/dev/null || true

echo "🚀 Subindo novo container localmente..."
sudo docker run -d -p 80:80 $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPO_NAME:latest

echo "✅ Deploy concluído!"
echo "🌐 Acesse: http://<IP_PUBLICO_DA_EC2> (libere a porta 80 no Security Group)"