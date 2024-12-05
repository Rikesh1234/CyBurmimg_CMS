const Category = require('../models/Category');
const Page = require('../models/StaticPage');
const Package = require('../models/Package');
const Post = require("../models/Post");
const CustomFieldValue = require("../models/CustomFieldValue");

const { fetchCustomFields } = require("../helper/customFieldHelper");
const { truncateWords } = require("../helper/truncateWord");

module.exports = async (req, res, next) => {
  try {
    // Fetch entities
    const [categories, pages, packages, posts] = await Promise.all([
      Category.find(),
      Page.find(),
      Package.find(),
      Post.find().sort({ createdAt: -1 }).limit(5),
    ]);
    const customField = await fetchCustomFields("Post");


    // Fetch latest blogs under 'blog' category
    const latestBlogs = await Post.find()
      .populate({ path: 'category', match: { slug: 'blog' } })
      .sort({ createdAt: -1 })
      .limit(3);
    const filteredLatestBlogs = latestBlogs.filter(post => post.category.length > 0);

    // Fetch custom fields for Posts, Pages, and Categories
    const [postCustomFields, pageCustomFields, categoryCustomFields] = await Promise.all([
      fetchCustomFields("Post"),
      fetchCustomFields("StaticPage"),
      fetchCustomFields("Category"),
    ]);

    // Fetch custom field values for Posts, Pages, and Categories
    const [postCustomFieldValues, pageCustomFieldValues, categoryCustomFieldValues] = await Promise.all([
      CustomFieldValue.find({ entityType: "Post" }),
      CustomFieldValue.find({ entityType: "StaticPage" }),
      CustomFieldValue.find({ entityType: "Category" }),
    ]);

    // Helper to enrich entities with custom fields and values
    const enrichEntitiesWithCustomFields = (entities, customFields, customFieldValues) => {
      return entities.map(entity => {
        const customFieldValuesObj = customFields.reduce((acc, field) => {
          const fieldValues = {};
          const valueRecords = customFieldValues.filter(val => val.customField.toString() === field._id.toString());

          field.field_name.forEach(fieldName => {
            const valueRecord = valueRecords.find(val => val.fieldName === fieldName);
            fieldValues[fieldName] = valueRecord ? valueRecord.value : "";
          });

          Object.assign(acc, fieldValues);
          return acc;
        }, {});

        return {
          ...entity.toObject(),
          customFieldValues: customFieldValuesObj,
        };
      });
    };

    // Enrich posts, pages, and categories with custom fields and values
    const enrichedPosts = enrichEntitiesWithCustomFields(posts, postCustomFields, postCustomFieldValues);
    const enrichedPages = enrichEntitiesWithCustomFields(pages, pageCustomFields, pageCustomFieldValues);
    const enrichedCategories = enrichEntitiesWithCustomFields(categories, categoryCustomFields, categoryCustomFieldValues);

    // User-related information
    const userInfo = req.session.user
      ? {
          loginFeaturedImage: req.session.user.featuredImage,
          loginUser: req.session.user.username,
        }
      : {
          loginFeaturedImage: null,
          loginUser: null,
        };

    // Contact details
    const contact = {
      phone: '+04 20 900 310',
      email: 'anilsah37618@gmail.com',
      socialLinks: {
        facebook: '#',
        instagram: '#',
        twitter: '#',
        linkedin: '#',
      },
    };
    
    // Set data in res.locals
    Object.assign(res.locals, {
      categories: enrichedCategories,
      pages: enrichedPages,
      packages,
      customField,
      posts: enrichedPosts,
      latestBlogs: filteredLatestBlogs,
      truncateWords,
      contact,
      ...userInfo,
    });

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};
