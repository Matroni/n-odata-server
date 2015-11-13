var enums = require('../constants/odata_enums');
var commons = require('../common/odata_common');

/**
 * A module for exporting common function that are used by several other
 * modules of the odata-server
 *
 * @param loopbackApplication
 * @param options
 */
module.exports = {
	handlePut: _handlePut,
	handlePatch: _handlePatch
};



/**
 * handles the PUT request to the OData server. The PUT request is used to update an entity where
 * only the submitted properties are set. All other properties are reset to their default values.
 * Be aware that this could lead to data loss. If you only want to change the submitted properties
 * and keep all other properties values use PATCH or MERGE (only OData V2.0).
 * @param req
 * @param res
 * @private
 */
function _handlePut(req, res) {
	var ModelClass = commons.getModelClass(req.app, req.params[0]);

	if(ModelClass) {
		var id = commons.getIdFromUrlParameter(req.params[0]);
		var reqObj = req.body;
		// create an object that is saved to the db and set all properties from request body
		// If not defined there set default value or undefined if no default has been defined
		var updateObj = {};
		ModelClass.forEachProperty(function(propName, property) {
			if(reqObj[propName]) {
				updateObj[propName] = reqObj[propName];
			} else {
				updateObj[propName] = property.default;
			}
		});

		var idName = ModelClass.getIdName();
		var whereObj = {};
		whereObj[idName] = id;
		// Here we use the static method updataAll. We could also have been read the entity
		// and updated it with update
		ModelClass.updateAll(whereObj, updateObj, function(err, results) {
			if(err || results.count === 0) {
				res.sendStatus(500);
			} else {
				res.sendStatus(204);
			}
		});
	} else {
		res.sendStatus(404);
	}
}

/**
 * handles the PATCH request to the OData server. The PATCH request is used to update an entity where
 * only the submitted properties are set. The other properties of the entity will not be changed.
 * @param req
 * @param res
 * @private
 */
function _handlePatch(req, res) {
	var ModelClass = commons.getModelClass(req.app, req.params[0]);

	if(ModelClass) {
		var id = commons.getIdFromUrlParameter(req.params[0]);
		var reqObj = req.body;
		// create an object that is saved to the db and set all properties from request body
		// If not defined there set default value or undefined if no default has been defined
		var updateObj = {};
		ModelClass.forEachProperty(function(propName, property) {
			if(reqObj[propName]) {
				updateObj[propName] = reqObj[propName];
			}
		});

		var idName = ModelClass.getIdName();
		var whereObj = {};
		whereObj[idName] = id;
		// Here we use the static method updataAll. We could also have been read the entity
		// and updated it with update
		ModelClass.updateAll(whereObj, updateObj, function(err, results) {
			if(err || results.count === 0) {
				res.sendStatus(500);
			} else {
				res.sendStatus(204);
			}
		});
	} else {
		res.sendStatus(404);
	}
}

