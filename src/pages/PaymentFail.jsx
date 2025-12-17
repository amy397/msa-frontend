import { useSearchParams, Link } from 'react-router-dom';

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  const getErrorDescription = (code) => {
    const errorMap = {
      'PAY_PROCESS_CANCELED': '결제가 취소되었습니다.',
      'PAY_PROCESS_ABORTED': '결제가 중단되었습니다.',
      'REJECT_CARD_COMPANY': '카드사에서 결제를 거절했습니다.',
      'INVALID_CARD_NUMBER': '유효하지 않은 카드 번호입니다.',
      'EXCEED_MAX_CARD_INSTALLMENT_PLAN': '할부 개월 수가 초과되었습니다.',
      'NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT': '지원하지 않는 할부 개월입니다.',
      'BELOW_MINIMUM_AMOUNT': '최소 결제 금액 미달입니다.',
      'INVALID_CARD_EXPIRATION': '카드 유효기간이 올바르지 않습니다.',
      'INVALID_STOPPED_CARD': '정지된 카드입니다.',
      'EXCEED_MAX_DAILY_PAYMENT_COUNT': '일일 결제 한도를 초과했습니다.',
      'EXCEED_MAX_PAYMENT_AMOUNT': '결제 한도를 초과했습니다.',
    };
    return errorMap[code] || '결제 처리 중 오류가 발생했습니다.';
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-red-600">&#10005;</span>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-red-600">결제 실패</h1>
        <p className="text-gray-600 mb-2">{getErrorDescription(errorCode)}</p>

        {errorMessage && (
          <p className="text-sm text-gray-500 mb-6">
            상세: {decodeURIComponent(errorMessage)}
          </p>
        )}

        {errorCode && (
          <p className="text-xs text-gray-400 mb-6">
            에러 코드: {errorCode}
          </p>
        )}

        <div className="space-y-2">
          <Link
            to="/checkout"
            className="block w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            다시 결제하기
          </Link>
          <Link
            to="/products"
            className="block w-full bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}
