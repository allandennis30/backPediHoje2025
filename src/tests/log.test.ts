import { logRouteAccess, getRouteLogs } from '../middlewares/log';
import ApiLog from '../models/ApiLog';

jest.mock('../models/ApiLog');

describe('routeLogger middleware', () => {
  const mockReq: any = { path: '/test-path' };
  const mockRes: any = {};
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call ApiLog.findOneAndUpdate with correct parameters', async () => {
    (ApiLog.findOneAndUpdate as jest.Mock).mockResolvedValue({ path: '/test-path', count: 1 });

    await logRouteAccess(mockReq, mockRes, mockNext);

    expect(ApiLog.findOneAndUpdate).toHaveBeenCalledWith(
      { path: '/test-path' },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    expect(mockNext).toHaveBeenCalled();
  });

  it('should call next even if ApiLog throws error', async () => {
    (ApiLog.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('DB error'));
    console.error = jest.fn();

    await logRouteAccess(mockReq, mockRes, mockNext);

    expect(console.error).toHaveBeenCalledWith('Erro ao salvar log de rota:', expect.any(Error));
    expect(mockNext).toHaveBeenCalled();
  });

  it('getRouteLogs should return the routeLogger object', () => {
    const logs = getRouteLogs();
    expect(logs).toEqual({});
  });
});