// ---------------POST VALIDATION RULE---------------------------------------------
const getPostValidationRules = () => {
    const rules = [];
  
    // Title validation: Required, must be a non-empty string
    rules.push(
      body('title')
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .isLength({ max: 255 }).withMessage('Title can be a maximum of 255 characters')
    );
  
    // Slug validation: Required, must be a non-empty string, must be unique
    rules.push(
      body('slug')
        .notEmpty().withMessage('Slug is required')
        .isString().withMessage('Slug must be a string')
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug must be in the correct format (lowercase letters, numbers, and hyphens)')
    );
  
    // Tag line: Optional but must be a string if provided
    rules.push(
      body('tag_line')
        .optional()
        .isString().withMessage('Tag line must be a string')
        .isLength({ max: 255 }).withMessage('Tag line can be a maximum of 255 characters')
    );
  
    // Summary: Optional but must be a string if provided
    rules.push(
      body('summary')
        .optional()
        .isString().withMessage('Summary must be a string')
    );
  
    // Content validation: Required, must be a non-empty string
    rules.push(
      body('content')
        .notEmpty().withMessage('Content is required')
        .isString().withMessage('Content must be a string')
    );
  
    // Category validation: Required, must be an array of valid MongoDB ObjectIds
    rules.push(
      body('category')
        .notEmpty().withMessage('Category is required')
        .isArray().withMessage('Category must be an array')
        .custom((value) => {
          // Validate that each category is a valid ObjectId
          return value.every(item => mongoose.Types.ObjectId.isValid(item));
        }).withMessage('Category must contain valid IDs')
    );
  
    // Author validation: Optional, but if provided must be a valid MongoDB ObjectId
    if (validationConfig.post.author) {
      rules.push(
        body('author')
          .optional()
          .custom(value => mongoose.Types.ObjectId.isValid(value)).withMessage('Author must be a valid ID')
      );
    }
  
    // Tags validation: Optional but must be an array of strings if provided
    if (validationConfig.post.tags) {
      rules.push(
        body('tags')
          .optional()
          .isArray().withMessage('Tags must be an array')
          .custom((value) => value.every(tag => typeof tag === 'string')).withMessage('Each tag must be a string')
      );
    }
  
    // Published date validation: Optional, but must be a valid date if provided
    rules.push(
      body('published_date')
        .optional()
        .isISO8601().withMessage('Published date must be a valid date')
    );
  
    return rules;
  };
// ---------------POST VALIDATION RULE END---------------------------------------------
