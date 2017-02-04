import Logger from 'js-logger';
import dateFormat from 'dateformat';


Logger.useDefaults();
Logger.setHandler(Logger.createDefaultHandler({
  formatter: function(messages, context) {
    // prefix each log message with a timestamp.
    let date = new Date();
    messages.unshift(dateFormat(date, "dd-mm hh:MM:ss.") + date.getMilliseconds());
    messages.unshift("[" + context.name + "]");
  }
}));

export function get(name) {
	return Logger.get(name);
}