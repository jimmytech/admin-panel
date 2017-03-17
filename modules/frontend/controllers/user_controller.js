const fs		=	require('fs'),
	path		=	require('path');

	




fs.watch('hello1/one.js', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});	