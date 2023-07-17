import express, { Request, Response} from 'express'
export const getSections = async (req: Request, res: any) => {
    //console.log(req.body);
    try {
        //console.log('aaaaa goes heres');
        return res.status(200).json(res?.filteredResults);
    
    } catch (error: any) {
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
    
}

export const addSections = async (req: Request, res: Response) => {
    
}