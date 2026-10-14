import autopopulatePlugin from 'mongoose-autopopulate';
import type { Schema } from 'mongoose';

// mongoose-autopopulate's types say "export default", but the package really does module.exports = fn.
// with our nodenext setup typescript reads the default import wrong, even though at runtime it IS the plugin.
// re-exporting it with the right type here means the rest of the code can just import and use it
export const autopopulate = autopopulatePlugin as unknown as (schema: Schema) => void
