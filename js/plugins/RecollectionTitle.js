//=============================================================================
// RecollectionTitle.js
//=============================================================================
/*:
 * @plugindesc Adds a "회상 방" command to the title screen that jumps
 * straight into the recollection room.
 *
 * @param Command Name
 * @default 회상 방
 *
 * @param Map ID
 * @default 20
 *
 * @param X
 * @default 8
 *
 * @param Y
 * @default 8
 */
(function() {
    var params = PluginManager.parameters('RecollectionTitle');
    var commandName = String(params['Command Name'] || '회상 방');
    var mapId = Number(params['Map ID'] || 20);
    var x = Number(params['X'] || 8);
    var y = Number(params['Y'] || 8);

    var _makeCommandList = Window_TitleCommand.prototype.makeCommandList;
    Window_TitleCommand.prototype.makeCommandList = function() {
        _makeCommandList.call(this);
        var index = this._list.findIndex(function(c) { return c.symbol === 'options'; });
        var cmd = { name: commandName, symbol: 'recollection', enabled: true, ext: null };
        if (index >= 0) {
            this._list.splice(index, 0, cmd);
        } else {
            this._list.push(cmd);
        }
    };

    var _createCommandWindow = Scene_Title.prototype.createCommandWindow;
    Scene_Title.prototype.createCommandWindow = function() {
        _createCommandWindow.call(this);
        this._commandWindow.setHandler('recollection', this.commandRecollection.bind(this));
    };

    Scene_Title.prototype.commandRecollection = function() {
        DataManager.setupNewGame();
        $gamePlayer.setTransparent(false);
        // Hide the HP status window, same as the post-boss route into this room.
        new Game_Interpreter().pluginCommand('ResidentWindow', ['Hide']);
        $gamePlayer.reserveTransfer(mapId, x, y, 8, 0);
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    };
})();
