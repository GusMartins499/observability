import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

const traceExporter = new OTLPTraceExporter();

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: 'api-service',
  [ATTR_SERVICE_VERSION]: '1.0.0',
});

const mergedResource = resource;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new NodeSDK({
  spanProcessors: [new BatchSpanProcessor(traceExporter)],
  traceExporter: new ConsoleSpanExporter(),
  metricReaders: [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter(),
    }),
  ],
  logRecordProcessors: [
    new SimpleLogRecordProcessor({ exporter: new OTLPLogExporter() }),
  ],
  instrumentations: [getNodeAutoInstrumentations()],
  resource: mergedResource,
});

sdk.start();

export default sdk;
