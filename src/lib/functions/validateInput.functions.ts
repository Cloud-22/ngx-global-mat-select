import { GlobalMatSelectConfig } from "../models/globalMatSelectConfig.interface";

export function validateInputConfig(config: GlobalMatSelectConfig) {
  if (!config)
    throw new Error('Error :: Can\'t handle "searchConfig" of undefined,' +
                    ' Did you forget to pass "SearchConfig" instance ?');
  // if (config !instanceof SearchConfigModel){
  //   throw new Error('Error :: Passed config is not a valid "searchConfig" instance');
  // }

  if (validateOptions(config))
    return true
}

function validateOptions(config: GlobalMatSelectConfig) {
  if (!config.options)
      throw new Error('Error :: Can\'t handle "options" of undefined, Did you passed options list of type "OptionsInterface" ?');
  if (!Array.isArray(config.options))
      throw new Error('Error :: "options" must be of type Array');

  return true;
}
