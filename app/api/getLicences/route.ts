import { type NextRequest, NextResponse } from 'next/server';

const PRIVATE_API_URL = 'https://w0v29jxde1.execute-api.us-east-1.amazonaws.com/v1/';

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

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

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return NextResponse.json(
        { error: 'Verificación de CAPTCHA fallida.' },
        { status: 403 }
      );
    }
    
    if (!licenceId) {
      return NextResponse.json(
        { error: 'El ID de la licencia es requerido.' },
        { status: 400 }
      );
    }

    const fullApiUrl = `${PRIVATE_API_URL}getLicences?Id=${licenceId}`;

    const apiResponse = await fetch(fullApiUrl, {
      method: 'GET',
      headers: {},
      cache: 'no-store', 
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      return NextResponse.json(
        { error: `Error en el servicio de licencias: ${apiResponse.statusText}` },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: 'Ocurrió un error interno en el servidor.' },
      { status: 500 }
    );
  }
}