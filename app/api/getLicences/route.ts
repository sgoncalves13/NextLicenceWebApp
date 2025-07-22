import { type NextRequest, NextResponse } from 'next/server';

// ESTA ES LA URL DE TU ENDPOINT PRIVADO EN AWS.
// Es seguro ponerla aquí porque este código solo se ejecuta en el servidor (tu EC2).
//const PRIVATE_API_URL = 'https://w0v29jxde1.execute-api.us-east-1.amazonaws.com/v1/';
const PRIVATE_API_URL = 'https://erei74m8ye.execute-api.us-east-1.amazonaws.com/v1/';


// Esta función manejará las peticiones GET a /api/getLicences
export async function GET(request: NextRequest) {
  try {
    // 1. Obtenemos los parámetros de la URL que nos envió el cliente.
    // ej: /api/getLicences?Id=ABC123456
    const searchParams = request.nextUrl.searchParams;
    const licenceId = searchParams.get('Id');

    // Validación básica en el servidor
    if (!licenceId) {
      return NextResponse.json(
        { error: 'El ID de la licencia es requerido.' },
        { status: 400 } // Bad Request
      );
    }

    // 2. Construimos la URL final para llamar a nuestro API Gateway privado.
    // Este fetch se ejecuta desde el servidor EC2, que SÍ tiene acceso a la VPC.
    const fullApiUrl = `${PRIVATE_API_URL}getLicence?Id=${licenceId}`;

    console.log(`Llamando al API Gateway privado: ${fullApiUrl}`);

    const apiResponse = await fetch(fullApiUrl, {
      method: 'GET',
      headers: {
        // Aquí puedes añadir cualquier cabecera que tu API Gateway requiera,
        // como una API Key si la tienes configurada.
        // 'x-api-key': 'TU_API_KEY_SI_APLICA'
      },
      // Es buena idea usar 'no-store' para asegurar que siempre se pidan datos frescos.
      cache: 'no-store', 
    });

    // 3. Verificamos si la respuesta del API Gateway fue exitosa.
    if (!apiResponse.ok) {
      // Si el API Gateway devuelve un error, lo pasamos al cliente.
      const errorBody = await apiResponse.text();
      console.error("Error desde el API Gateway:", errorBody);
      return NextResponse.json(
        { error: `Error en el servicio de licencias: ${apiResponse.statusText}` },
        { status: apiResponse.status }
      );
    }

    // 4. Si todo fue bien, obtenemos el JSON y lo devolvemos al componente del cliente.
    const data = await apiResponse.json();

    return NextResponse.json(data);

  } catch (error) {
    // Capturamos cualquier otro error (ej: de red entre EC2 y API Gateway)
    console.error("Error interno en el API route:", error);
    return NextResponse.json(
      { error: 'Ocurrió un error interno en el servidor.' },
      { status: 500 } // Internal Server Error
    );
  }
}