const {Tracer, ExplicitContext, ConsoleRecorder, BatchRecorder} = require('zipkin')
const {HttpLogger} = require('zipkin-transport-http')
const wrapRequest = require('zipkin-instrumentation-request')
const request = require('request')
import {TraceId} from 'zipkin'

const recorderOptions = {
    logger: new HttpLogger({
      endpoint: `${process.env.ZIPKIN_HOST}/api/v1/spans`,
    }),
}
const recorder = process.env.ZIPKIN_HOST ? new BatchRecorder(recorderOptions) : new ConsoleRecorder()

export const getTracer = (id?: TraceId, options?) => {
  const ctxImpl = new ExplicitContext()
  const tracerOptions = Object.assign({
    ctxImpl,
    recorder,
    localServiceName: 'swapi-apollo',
  }, options)
  const trace = new Tracer(tracerOptions)
  if (id !== undefined) {
    trace.setId(id.traceId)
  }
  return trace
}

export const tracer = getTracer()
