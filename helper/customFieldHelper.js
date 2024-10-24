const CustomField = require("../models/CustomField");
const CustomFieldValue = require("../models/CustomFieldValue");
const Model = require("../models/Model");

const fetchCustomFields = async (moduleName, entityId = null) => {
  try {
    const model = await Model.findOne({ name: moduleName });

    if (!model) {
      throw new Error(`Model not found for name: ${moduleName}`);
    }

    // Fetch custom fields
    const customFields = await CustomField.find({ model: model._id })
      .populate({ path: "target_type" });

    // If entityId is provided, fetch existing values
    if (entityId) {
      const fieldValues = await CustomFieldValue.find({
        model: model._id,
        entityId: entityId
      });

      // Merge values with custom fields
      const mergedFields = customFields.map(field => {
        const fieldData = field.toObject();
        fieldData.values = {};
        
        field.field_name.forEach((name, index) => {
          const valueRecord = fieldValues.find(v => v.fieldName === name);
          fieldData.values[name] = valueRecord ? valueRecord.value : '';
        });
        
        return fieldData;
      });

      return mergedFields;
    }

    return customFields;
  } catch (error) {
    console.error(`Error fetching custom fields for ${moduleName}:`, error);
    throw new Error(`Could not fetch custom fields for ${moduleName}`);
  }
};

const saveCustomFieldValues = async (moduleName, entityId, fieldData) => {
  try {
    const model = await Model.findOne({ name: moduleName });
    if (!model) throw new Error(`Model not found for name: ${moduleName}`);

    const customFields = await CustomField.find({ model: model._id });
    
    // Create bulk operations array
    const operations = [];
    
    for (const field of customFields) {
      field.field_name.forEach(async (fieldName) => {
        if (fieldData[fieldName] !== undefined) {
          // Using findOneAndUpdate with upsert for each field
          operations.push({
            updateOne: {
              filter: {
                customField: field._id,
                model: model._id,
                entityId: entityId,
                fieldName: fieldName
              },
              update: {
                $set: { value: fieldData[fieldName] }
              },
              upsert: true
            }
          });
        }
      });
    }

    if (operations.length > 0) {
      await CustomFieldValue.bulkWrite(operations);
    }

    return true;
  } catch (error) {
    console.error('Error saving custom field values:', error);
    throw error;
  }
};

module.exports = { fetchCustomFields, saveCustomFieldValues };
