class ProductionService {
    private isProduction: boolean;
    constructor(isProduction: boolean) {
        this.isProduction = isProduction;
    }

    public getIsProduction(): boolean {
        return this.isProduction;
    }
}

export const productionService = new ProductionService(false);