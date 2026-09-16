# A427-A432 — Additional DataWeave system-property and Java/memory gaps

These questions were selected after reviewing the current curated bank and checking the current DataWeave system-property reference. They are intended to add materially different runtime behavior rather than duplicate existing memory, Java interop, or format questions.

## A427 — Writer character-buffer sizing

**Difficulty:** Advanced  
**Focus:** Writer buffering / `com.mulesoft.dw.charbuffersize`

### Question
A DataWeave application produces a large text output and the team wants to tune the internal buffer used specifically by the writer. Which system property controls that writer buffer, what unit does it use, and how is it different from `com.mulesoft.dw.buffersize`?

### Expected answer
`com.mulesoft.dw.charbuffersize` controls the size of the buffer used by the DataWeave writer. Its value is measured in bytes, and the documented default is `4096`. It is different from `com.mulesoft.dw.buffersize`, which controls the in-memory input and output buffers used to retain processed inputs and outputs before DataWeave can spill excess data to temporary files.

### Explanation
The two properties affect different buffering layers. `charbuffersize` is writer-specific, while `buffersize` concerns DataWeave's broader input/output retention buffers.

### Common mistake
Treating both properties as interchangeable global memory limits.

### Interview tip
When tuning DataWeave memory, identify whether the bottleneck is writer buffering, retained payload buffering, indexed-reader pages, or off-heap pool allocation before changing a property.

---

## A428 — Java bean public-interface definition lookup

**Difficulty:** Advanced  
**Focus:** Java interoperability / `com.mulesoft.dw.java.enabled_class_definition_lookup`

### Question
A DataWeave application running on JDK 17+ receives a Java bean through an interface and accesses its properties reflectively. The implementation class has accessibility restrictions, while the public interface exposes the required properties. Which DataWeave system property controls whether JavaModuleLoader honors the public interface definition, and what changes when it is disabled?

### Expected answer
`com.mulesoft.dw.java.enabled_class_definition_lookup` controls this behavior. When `true`, JavaModuleLoader honors the public interface definition of the bean instance when accessing properties through reflection. When `false`, it uses the specific bean implementation class definition, which can result in accessibility issues. Current documentation states that the default is `true` for JDK 17+ with language levels greater than 2.10, with documented defaults varying by language level.

### Explanation
This is specifically about choosing the public interface definition versus the concrete bean class for reflective property access. It is separate from the `setAccessible` control and from general Java bean getter/setter selection.

### Common mistake
Assuming the property simply grants reflective access to private members. It instead controls which class/interface definition JavaModuleLoader uses for property access.

### Interview tip
For Java interop failures, distinguish class-definition lookup, accessor selection, JPMS restrictions, and `setAccessible` behavior as separate layers.

---

## A429 — Getter/setter versus field accessor selection

**Difficulty:** Advanced  
**Focus:** Java bean property access / `com.mulesoft.dw.java.honour_bean_definition_accessor`

### Question
A Java bean exposes a property through getter/setter methods and also contains a field with related state. DataWeave property selection must follow the bean definition rather than falling back to field access. Which system property controls this behavior, and what is the distinction between the enabled and disabled modes?

### Expected answer
`com.mulesoft.dw.java.honour_bean_definition_accessor` controls the behavior. When `true`, JavaModuleLoader honors the bean definition and uses getter/setter methods to access properties through object value selectors. When `false`, getter/setter access is used for existing properties, while field access can be used as the default when the property is not exposed through the bean accessor definition. Current documentation lists `false` for language level 2.8 and `true` for 2.9 through 2.12.

### Explanation
This property controls accessor-selection semantics for Java bean properties. It is distinct from A428's interface-versus-concrete-class lookup and A426's reflection accessibility flag.

### Common mistake
Thinking this property determines whether reflection is allowed at all. It controls the accessor mechanism used for Java bean properties.

### Interview tip
When a DataWeave selector behaves differently against two Java classes, inspect the bean contract and accessor methods before assuming the issue is a type-coercion problem.

---

## A430 — DataWeave off-heap memory-pool sizing

**Difficulty:** Advanced  
**Focus:** Memory management / `com.mulesoft.dw.memory_pool_size`

### Question
A deployment uses DataWeave's off-heap buffering and the team needs to understand how the number of available memory slots affects the total off-heap capacity. Which property controls the number of slots, and how does it combine with `com.mulesoft.dw.max_memory_allocation`?

### Expected answer
`com.mulesoft.dw.memory_pool_size` controls the number of slots in the DataWeave memory pool. The documented default is `60`. The off-heap pool can provide capacity based on the product of `memory_pool_size` and `max_memory_allocation`. DataWeave allocates the remainder using heap memory. `max_memory_allocation` therefore controls the size of each slot, while `memory_pool_size` controls how many slots exist.

### Explanation
This is a pool-capacity question, not a general off-heap-versus-heap switch. A417 already covers the selection between direct/off-heap and heap buffering; A430 focuses on how the off-heap pool is sized when that mechanism is in use.

### Common mistake
Treating `memory_pool_size` as a byte-size property. It represents the number of slots.

### Interview tip
For DataWeave memory diagnostics, distinguish the buffer threshold, off-heap/heap selection, slot count, and per-slot allocation size.

---

## A431 — Per-slot off-heap allocation limit

**Difficulty:** Advanced  
**Focus:** Memory management / `com.mulesoft.dw.max_memory_allocation`

### Question
A DataWeave deployment uses off-heap buffering and needs to control the maximum number of bytes allocated to each memory-pool slot before payload data is backed by temporary files. Which property controls the per-slot allocation size, and how is it different from `memory_pool_size`?

### Expected answer
`com.mulesoft.dw.max_memory_allocation` controls the size in bytes of each slot in the DataWeave off-heap memory pool. The documented default is `1572864` bytes. When payloads exceed the available allocation, DataWeave can store the remainder in temporary files. `memory_pool_size` controls the number of slots, whereas `max_memory_allocation` controls the size of each slot.

### Explanation
A430 and A431 intentionally separate two dimensions of the same memory-pool design: slot count versus bytes per slot. This is materially different from A423's input/output buffer spill threshold and A417's heap/off-heap selection.

### Common mistake
Multiplying or tuning these properties without understanding that one is a slot count and the other is a per-slot byte allocation.

### Interview tip
When explaining memory-pool capacity, describe both dimensions explicitly instead of calling either property a generic memory limit.

---

## A432 — JSON binary encoding and writer-encoding compatibility

**Difficulty:** Advanced  
**Focus:** JSON binary output / `com.mulesoft.dw.decode_binaries_with_writer_encoding`

### Question
A DataWeave transformation writes a JSON document containing Binary values, and the application needs those binary values to use the JSON writer's encoding rather than the encoding selected from the value schema or default encoding. Which system property changes this behavior, and what is its default?

### Expected answer
Set `com.mulesoft.dw.decode_binaries_with_writer_encoding` to `true`. With this setting, binary values in JSON are written using the JsonWriter encoding. When it is `false`, DataWeave uses the encoding defined in the value schema or the default encoding. The documented default is `false`.

### Explanation
This question focuses on the interaction between Binary values and JSON writer encoding. It is distinct from generic Base64 transformation questions because the behavior concerns how binary values are written by the JSON writer under a system-property compatibility setting.

### Common mistake
Assuming the property changes all Binary-to-String coercions everywhere. Its documented behavior is specifically about Binary values in JSON output and JsonWriter encoding.

### Interview tip
When debugging binary text output, identify whether the issue is Base64 conversion, binary coercion, schema encoding, or writer encoding before changing the transformation itself.

---

## Duplication review

The current curated repository was checked for the exact system-property concepts before these additions. The selected concepts were not already represented as dedicated questions:

- `com.mulesoft.dw.charbuffersize`
- `com.mulesoft.dw.java.enabled_class_definition_lookup`
- `com.mulesoft.dw.java.honour_bean_definition_accessor`
- `com.mulesoft.dw.memory_pool_size`
- `com.mulesoft.dw.max_memory_allocation`
- `com.mulesoft.dw.decode_binaries_with_writer_encoding`

They are deliberately separated from existing coverage of general buffer sizing, off-heap selection, Java reflection accessibility, Java bean discovery, and Base64 processing.

## Source basis

The current DataWeave System Properties documentation describes these properties and their defaults. Property availability and compatibility behavior can depend on the configured DataWeave language level, not only the Mule runtime version.
