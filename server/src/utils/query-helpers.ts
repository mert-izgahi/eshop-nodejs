import { type Request } from "express";
export interface IQuery {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortType: 1 | -1,
    queryObj: any
}
export const getCategoriesQuery = (req: Request): IQuery => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = req.query.sortBy as string || "name";
    const sortType = req.query.sortType as string === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;


    const queryObj = {} as any;


    if (req.query.search) {
        queryObj.name = { $regex: req.query.search, $options: "i" };
    }

    return {
        page,
        limit,
        skip,
        sortBy,
        sortType,
        queryObj
    };
};

export const getAccountsQuery = (req: Request): IQuery => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = req.query.sortBy as string || "name";
    const sortType = req.query.sortType as string === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;


    const queryObj = {} as any;


    if (req.query.search) {
        queryObj.firstName = { $regex: req.query.search, $options: "i" };
        queryObj.lastName = { $regex: req.query.search, $options: "i" };
        queryObj.email = { $regex: req.query.search, $options: "i" };
    }

    return {
        page,
        limit,
        skip,
        sortBy,
        sortType,
        queryObj
    }
}