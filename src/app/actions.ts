"use server";

export async function getAdviceAction() {
  try {
    // In a real application, you would fetch the user's actual transaction history from your database.
    // For this example, we'll return a mock advice.
    const mockAdvice = "Este es un consejo financiero de ejemplo. Ahorra más y gasta menos para alcanzar tus metas financieras. Considera invertir en fondos indexados de bajo costo.";
    
    return { advice: mockAdvice };
  } catch (error) {
    console.error(error);
    return { error: "No se pudieron obtener los consejos financieros. Por favor, inténtalo de nuevo más tarde." };
  }
}
