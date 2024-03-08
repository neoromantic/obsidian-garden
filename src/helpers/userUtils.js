// Put your computations here.

export function userComputed(data) {
  return {
    updatedOnAnotherDay: Math.abs(new Date(data.updated) - new Date(data.created)) > 24*60*60*1000
  };
}
