import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentFail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="container mx-auto p-6 max-w-lg text-center">
      <div className="bg-white rounded-lg shadow p-10">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-red-600">결제에 실패했습니다</h1>
        <p className="text-gray-600 mb-6">
          {errorMessage || '결제 처리 중 문제가 발생했습니다.'}
        </p>

        {errorCode && (
          <div className="bg-gray-50 rounded p-4 mb-6 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">오류 코드</span>
              <span className="font-mono">{errorCode}</span>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도하기
          </button>
          <button
            onClick={() => navigate('/products')}
            className="flex-1 py-2 border rounded hover:bg-gray-50"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  );
}
