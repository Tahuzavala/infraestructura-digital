document.getElementById('lead-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        mensaje: document.getElementById('mensaje').value
    };

    // Aquí pegaremos tu Webhook de n8n más adelante
    console.log('Datos listos para n8n:', data);
    
    document.getElementById('form-response').innerHTML = 
        "<p style='color: #00ff00;'>DESPLIEGUE EXITOSO. NOS CONTACTAREMOS PRONTO.</p>";
    this.reset();
});