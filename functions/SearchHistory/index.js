const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { query } = body;

    const savedQuery = await prisma.searchHistory.create({
      data: {
        query,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, savedQuery }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
