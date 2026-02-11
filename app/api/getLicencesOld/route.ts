import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const PRIVATE_API_URL = process.env.PRIVATE_API_URL;

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export async function GET(request: NextRequest) {
  try {

    const headersList = headers();
    console.log(headersList);
    const forwardedFor = (await headersList).get('x-forwarded-for');
    let clientIp = 'UNKNOWN';

    if (forwardedFor) {
      clientIp = forwardedFor.split(',')[0].trim();
    } 
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

    const fullApiUrl = `${PRIVATE_API_URL}getLicencesOld?Id=${licenceId}`;

    const apiResponse = await fetch(fullApiUrl, {
      method: 'GET',
      headers: {
        'X-Client-IP': clientIp,
      },
      cache: 'no-store', 
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.json();
      return NextResponse.json(
        { error: errorBody.error },
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