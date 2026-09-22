import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import {
  diag,
  DiagConsoleLogger,
  DiagLogLevel,
  metrics,
} from '@opentelemetry/api';

const SERVICE_NAME = 'api-2-service';

const traceExporter = new OTLPTraceExporter();
const metricsExporter = new OTLPMetricExporter();
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricsExporter,
  exportIntervalMillis: 10_000,
});

const logExporter = new OTLPLogExporter();
const logRecordProcessor = new BatchLogRecordProcessor({
  exporter: logExporter,
});

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: SERVICE_NAME,
  [ATTR_SERVICE_VERSION]: '2.0.0',
});

const mergedResource = resource;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new NodeSDK({
  traceExporter,
  metricReaders: [metricReader],
  logRecordProcessors: [logRecordProcessor],
  instrumentations: [
    getNodeAutoInstrumentations({
      // envia todo log do pino para o collector (OTLP) e injeta
      // trace_id/span_id no log, ligando log <-> trace no Grafana
      '@opentelemetry/instrumentation-pino': {
        enabled: true,
        disableLogSending: false,
        disableLogCorrelation: false,
      },
    }),
  ],
  resource: mergedResource,
  serviceName: SERVICE_NAME,
});

sdk.start();

export { sdk, metrics };
