import { useFusionContext, FusionEnvironment } from '../core/FusionContext';

export default (): FusionEnvironment => {
    const fusionContext = useFusionContext();

    return fusionContext.environment;
};
