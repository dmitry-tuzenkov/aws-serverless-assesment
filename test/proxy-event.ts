import { APIGatewayProxyEvent } from 'aws-lambda';

export const createProxyEvent = (): APIGatewayProxyEvent => ({
  resource: '/persons',
  path: '/persons',
  httpMethod: 'GET',
  headers: {
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Desktop-Viewer': 'true',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'CloudFront-Is-SmartTV-Viewer': 'false',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Viewer-ASN': '33915',
    'CloudFront-Viewer-Country': 'NL',
    Host: 'dtzcf4540b.execute-api.eu-central-1.amazonaws.com',
    'sec-ch-ua':
      '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Via: '2.0 de31699a6e25448909328bb7c6028f6a.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'CmKB1X1DLHycDhb-GZDa_yz4dHMQZwoQHht_DC0dVSxwV8H9gQc_Iw==',
    'X-Amzn-Trace-Id': 'Root=1-65a661b9-43cac16f39537d0e09a6b02d',
    'X-Forwarded-For': '83.85.14.59, 64.252.178.98',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https',
  },
  multiValueHeaders: {
    Accept: [
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    ],
    'Accept-Encoding': ['gzip, deflate, br'],
    'Accept-Language': ['en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7'],
    'CloudFront-Forwarded-Proto': ['https'],
    'CloudFront-Is-Desktop-Viewer': ['true'],
    'CloudFront-Is-Mobile-Viewer': ['false'],
    'CloudFront-Is-SmartTV-Viewer': ['false'],
    'CloudFront-Is-Tablet-Viewer': ['false'],
    'CloudFront-Viewer-ASN': ['33915'],
    'CloudFront-Viewer-Country': ['NL'],
    Host: ['dtzcf4540b.execute-api.eu-central-1.amazonaws.com'],
    'sec-ch-ua': [
      '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    ],
    'sec-ch-ua-mobile': ['?0'],
    'sec-ch-ua-platform': ['"macOS"'],
    'sec-fetch-dest': ['document'],
    'sec-fetch-mode': ['navigate'],
    'sec-fetch-site': ['none'],
    'sec-fetch-user': ['?1'],
    'upgrade-insecure-requests': ['1'],
    'User-Agent': [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ],
    Via: ['2.0 de31699a6e25448909328bb7c6028f6a.cloudfront.net (CloudFront)'],
    'X-Amz-Cf-Id': ['CmKB1X1DLHycDhb-GZDa_yz4dHMQZwoQHht_DC0dVSxwV8H9gQc_Iw=='],
    'X-Amzn-Trace-Id': ['Root=1-65a661b9-43cac16f39537d0e09a6b02d'],
    'X-Forwarded-For': ['83.85.14.59, 64.252.178.98'],
    'X-Forwarded-Port': ['443'],
    'X-Forwarded-Proto': ['https'],
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    resourceId: '7ao3ux',
    resourcePath: '/persons',
    httpMethod: 'GET',
    extendedRequestId: 'RoQ1GGgjliAEMYQ=',
    requestTime: '16/Jan/2024:11:00:09 +0000',
    path: '/prod/persons',
    accountId: '382605050318',
    protocol: 'HTTP/1.1',
    stage: 'prod',
    domainPrefix: 'dtzcf4540b',
    requestTimeEpoch: 1705402809934,
    requestId: '20085d91-a7b8-47d1-a48e-e0122d8517ce',
    identity: {
      apiKey: '',
      apiKeyId: '',
      clientCert: null,
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '83.85.14.59',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      user: null,
    },
    domainName: 'dtzcf4540b.execute-api.eu-central-1.amazonaws.com',
    apiId: 'dtzcf4540b',
    authorizer: undefined,
  },
  body: null,
  isBase64Encoded: false,
});
