import { type NextRequest, NextResponse } from 'next/server';

//const PRIVATE_API_URL = 'https://w0v29jxde1.execute-api.us-east-1.amazonaws.com/v1/';
const PRIVATE_API_URL = 'https://erei74m8ye.execute-api.us-east-1.amazonaws.com/v1/';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;


// Esta función manejará las peticiones GET a /api/getLicences
export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const licenceId = searchParams.get('Id');
    const captchaToken = searchParams.get('captchaToken');

    if (!captchaToken) {
      return NextResponse.json(
        { error: 'Verificación de CAPTCHA fallida. Token no proporcionado.' },
        { status: 403 }
      );
    }

    // Llama a la API de Google para verificar el token
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      console.warn("Intento de acceso con CAPTCHA inválido:", recaptchaData['error-codes']);
      return NextResponse.json(
        { error: 'Verificación de CAPTCHA fallida.' },
        { status: 403 }
      );
    }


    console.log(`CAPTCHA verificado. Llamando al API Gateway para la licencia: ${licenceId}`);
    
    if (!licenceId) {
      return NextResponse.json(
        { error: 'El ID de la licencia es requerido.' },
        { status: 400 } // Bad Request
      );
    }

    const fullApiUrl = `${PRIVATE_API_URL}getLicence?Id=${licenceId}`;

    console.log(`Llamando al API Gateway privado: ${fullApiUrl}`);

    const apiResponse = await fetch(fullApiUrl, {
      method: 'GET',
      headers: {},
      cache: 'no-store', 
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error("Error desde el API Gateway:", errorBody);
      return NextResponse.json(
        { error: `Error en el servicio de licencias: ${apiResponse.statusText}` },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error interno en el API route:", error);
    return NextResponse.json(
      { error: 'Ocurrió un error interno en el servidor.' },
      { status: 500 }
    );
  }
}