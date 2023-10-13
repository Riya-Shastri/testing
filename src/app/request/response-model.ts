
export class ResponseModel {
	// fields
	responseBody: responseBody;
	contentType: number;
	statusCode: number;
}

export class responseBody{
	description: any[];
	content: any;
	isSuccessful: boolean;
	
	constructor(
		_description: any[] = [],
		_totalCount: number = 0,
		_errorMessage: string = ''
	) {
		this.description = _description;
	}
}

export class ResponseSearchModel{
	responseBody: responseSearchBody;
	contentType: number;
	statusCode: number;
}

export class responseSearchBody{
	description: any[];
	content: ResponseContent;
	isSuccessful: boolean;
	
	constructor(
		_description: any[] = [],
		_totalCount: number = 0,
		_errorMessage: string = ''
	) {
		this.description = _description;
	}
}

export class ResponseContent{
	entities: any;
	pagination: Pagination;
}

export class Pagination{
	pageNo: number;
	pageCount: number;
	totalRowCount: number;
	firstPage: boolean;
	previousPage: boolean;
	nextPage: boolean;
	lastPage: boolean;
}