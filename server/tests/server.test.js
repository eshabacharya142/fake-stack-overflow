const { default: mongoose } = require("mongoose");

describe('SIGINT Event Handling', () => {

  test('Closing server and disconnecting MongoDB on SIGINT event', (done) => {
    let server = require("../server");
    console.log = jest.fn();
    server.close = jest.fn();
    mongoose.disconnect = jest.fn();
    const originalProcessExit = process.exit;
    process.exit = jest.fn();

    
    process.emit("SIGINT");

    expect(server.close).toHaveBeenCalled();
    expect(mongoose.disconnect).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Server closed. Database instance disconnected");
    expect(process.exit).toHaveBeenCalledWith(0);

    process.exit = originalProcessExit;
    done();
  });

});
