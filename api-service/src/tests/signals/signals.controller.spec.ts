import { Request, Response } from "express";

import { SignalsController } from "../../controllers";
import { mockSignal } from "../fixtures";

const createSignalMock = jest.fn();
const getSignalByIdMock = jest.fn();
const searchSignalsMock = jest.fn();
const deleteSignalByIdMock = jest.fn();

jest.mock("../../services", () => {
  return {
    SignalsService: jest.fn().mockImplementation(() => {
      return {
        createSignal: createSignalMock,
        getSignalById: getSignalByIdMock,
        searchSignals: searchSignalsMock,
        deleteSignalById: deleteSignalByIdMock,
      };
    }),
  };
});

describe("SinglasController", () => {
  let controller: SignalsController;
  
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  
  beforeEach(() => {
    controller = new SignalsController();
    jest.clearAllMocks();
  });
    
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create new signal.", async () => {
    const signal = mockSignal(1);
    createSignalMock.mockResolvedValue(signal);
    await controller.createSignal({ body: signal } as Request, mockResponse as unknown as Response);
    expect(createSignalMock).toHaveBeenCalledTimes(1);
    expect(createSignalMock).toHaveBeenCalledWith(signal);
  });

  test("Should get signal by id.", async () => {
    const signal = mockSignal(1);
    const params = { id: signal.id };
    getSignalByIdMock.mockResolvedValue(signal);
    
    await controller.getSignalById(
      { params } as unknown as Request, 
      mockResponse as unknown as Response
    );
    
    expect(getSignalByIdMock).toHaveBeenCalledTimes(1);
    expect(getSignalByIdMock).toHaveBeenCalledWith(params.id);
  });

  test("Should search signals.", async () => {
    const signal = mockSignal(1);
    searchSignalsMock.mockResolvedValue([signal]);
    await controller.searchSignals({} as Request, mockResponse as unknown as Response);
    expect(searchSignalsMock).toHaveBeenCalledTimes(1);
    expect(searchSignalsMock).toHaveBeenCalledWith(undefined, "DESC");
  });
  
  test("Should delete signal by id.", async () => {
    const params = { id: 1 };
    await controller.deleteSignalById({ params } as unknown as Request, mockResponse as unknown as Response);
    expect(deleteSignalByIdMock).toHaveBeenCalledTimes(1);
    expect(deleteSignalByIdMock).toHaveBeenCalledWith(params.id);
  });
});
